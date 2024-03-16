"use client"
import * as d3 from 'd3';
import UMLBox, { Dimensions, Point, UMLBoxProps } from './UMLBox.client';
import ToolPalette from './ToolPalette.client';
import { Grid, AStarFinder } from 'pathfinding';
import { useEffect, useRef, useState } from 'react';
import NodeList from './component/NodeList';
import { IFolder } from './component/Interfaces';

const Line: React.FC<LineProps> = ({ startX, startY, endX, endY, controlX, controlY, style, color = "black" }) => {
  let d: string; // Este será el atributo 'd' del path de SVG
  if (controlX !== undefined && controlY !== undefined) {
    // Si hay un punto de control, dibuja una curva cuadrática
    d = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
  } else {
    // Si no hay punto de control, dibuja una línea recta
    d = `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  return (
    <path
      d={d}
      stroke={color}
      strokeWidth="2"
      fill="none"
      strokeDasharray={style === 'dotted' ? '1 3' : style === 'dashed' ? '6 6' : ''}
    />
  );
};


interface LineProps {
  startBoxId: string;
  endBoxId: string;
  path: Point[];
  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  style: string;
  controlX?: number;
  controlY?: number;
  color?: string;
}

// Ajustes a la interfaz UMLBoxProps para incluir topText y bottomText
interface UMLBoxExtendedProps extends UMLBoxProps {
  topText: string[];
  bottomText: string[];
}
const UMLCanvas = () => {
  const [boxes, setBoxes] = useState<UMLBoxProps[]>([]);
  const [lineStyle, setLineStyle] = useState('dotted');
  const [lines, setLines] = useState<LineProps[]>([]);
  const [isLineModeEnabled, setIsLineModeEnabled] = useState(false);
  const [isZoomModeEnabled, setIsZoomModeEnabled] = useState(true);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [lineStartPoint, setLineStartPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<LineProps | null>(null)
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<SVGGElement>(null);

  useEffect(() => {
    // Inicializa el área SVG aquí si es necesario
    const svg = d3.select(svgRef.current);
    if(isZoomModeEnabled){
      const zoom = d3.zoom().on('zoom', (event) => {
        d3.select(zoomRef.current).attr('transform', event.transform);
      });
      svg.call(zoom as any);
    }
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    svg.on('mousedown', (event) => {
      if (!isDrawingLine || !lineStartPoint) return;
      const [x, y] = d3.pointer(event);
      setCurrentLine({ startX: lineStartPoint.x, startY: lineStartPoint.y, endX: x, endY: y, style: lineStyle } as any);
    });

    svg.on('mousemove', (event) => {
      if (!isDrawingLine || !lineStartPoint) return;
      const [x, y] = d3.pointer(event);
      console.log({ x, y })
      setCurrentLine({ startX: lineStartPoint.x, startY: lineStartPoint.y, endX: x, endY: y, style: lineStyle } as any);
    });

    svg.on('mouseup', () => {
      setIsDrawingLine(false);
      setCurrentLine(null);
    });

    // Asegúrate de limpiar los eventos para evitar duplicados
    return () => {
      svg.on('mousedown', null);
      svg.on('mousemove', null);
      svg.on('mouseup', null);
    };
  }, [currentLine, lineStartPoint, lineStyle]);

  const handleDoubleClick = (boxId: string) => {
    if (isLineModeEnabled) return; // Asegúrate de que el modo de línea esté habilitado
    console.log("hola")

    // Si no hay un cuadro de inicio, este cuadro será el inicio de la línea
    const box = boxes.find(box => box.id === boxId);
    if (!box) return;
    if (!currentLine) {
      if (box) {
        const newLine: any = {
          startBoxId: boxId,
          startX: box.initialPosition.x + box.initialWidth / 2,
          startY: box.initialPosition.y + box.initialHeight / 2,
          endX: box.initialPosition.x + box.initialWidth / 2, // Temporalmente igual al punto de inicio
          endY: box.initialPosition.y + box.initialHeight / 2, // Temporalmente igual al punto de inicio
          style: 'solid' // O el estilo que desees
        };
        setCurrentLine(newLine);
      }
    } else {
      // Finaliza la línea actual en el segundo cuadro
      const box: any = boxes.find(box => box.id === boxId);
      if (box && currentLine.startBoxId !== boxId) {
        const finishedLine = {
          ...currentLine,
          endBoxId: boxId,
          endX: box.initialPosition.x + box.initialWidth / 2,
          endY: box.initialPosition.y + box.initialHeight / 2
        };
        setLines([...lines, finishedLine]);
        setCurrentLine(null); // Resetea la línea actual;
        setLineStartPoint(null);
      }
    }
  };


  const addBox = (title:string, topText: any[], bottomText: any[]) => {
    // Calcular una nueva posición para evitar solapamientos
    let newX = 50;
    let newY = 50;
    // Encuentra el cuadro más a la derecha y abajo para colocar el nuevo cuadro
    boxes.forEach(box => {
      if (box.initialPosition.x >= newX) newX = box.initialPosition.x + box.initialWidth + 10; // 10 es un margen
      if (box.initialPosition.y >= newY) newY = box.initialPosition.y + 10; // Se podría mejorar para considerar la altura también
    });

    const newBox = {
      id: `box-${boxes.length + 1}`,
      initialPosition: { x: newX, y: newY },
      initialWidth: 100,
      initialHeight: 50,
      topText,
      type: 'clase',
      title,
      bottomText,
      onDoubleClick: () => handleDoubleClick(`box-${boxes.length + 1}`),
      onUpdate: (data: { id: string; position: Point; dimensions: Dimensions; text: string[] }) => {
        updateBox(data); // Llama a una función que maneje las actualizaciones de los cuadros UML
      },
      // La función onClick (si es necesaria) puede ser implementada para manejar clics en el cuadro UML
      onClick: (e: React.MouseEvent, id: string) => {
        // Implementa lo que debe suceder cuando se hace clic en un cuadro UML, si es necesario
      }
    };
    setBoxes([...boxes, newBox]);
  };

  const handlePositionChange = (id: string, newPosition: Point) => {
    // Actualiza la posición del cuadro
    setBoxes(boxes.map(box => box.id === id ? { ...box, initialPosition: newPosition } : box));

    // Actualiza las líneas conectadas al cuadro que se está moviendo
    setLines(lines.map(line => {
      // Busca el cuadro por su id para obtener sus dimensiones
      const box = boxes.find(b => b.id === id);
      if (!box) return line

      if (line.startBoxId === id) {
        return { ...line, startX: newPosition.x + box.initialWidth / 2, startY: newPosition.y + box.initialHeight / 2 };
      } else if (line.endBoxId === id) {
        return { ...line, endX: newPosition.x + box.initialWidth / 2, endY: newPosition.y + box.initialHeight / 2 };
      }
      return line;
    }));
  };

  const handleSizeChange = (id: string, newWidth: number, newHeight: number) => {
    console.log("handleSizeChange")
    setBoxes(boxes.map(box =>
      box.id === id ? { ...box, initialWidth: newWidth, initialHeight: newHeight } : box
    ));
  };

  const changeLineStyle = (style: any) => {
    console.log(style)
    createUMLClass("Hola",[
      {
        "name": "propiedad1",
        "type": "string"
      },
      {
        "name": "propiedad2",
        "type": "number"
      }
    ])
    setLineStyle(style);
  };

  const handleTextChange = (id: string, newText: string[]) => {
    setBoxes(boxes.map(box =>
      box.id === id ? { ...box, initialText: newText } : box
    ));
  };

  const updateBox = (data: { id: string; position?: Point; dimensions?: Dimensions; text?: string[] }) => {
    setBoxes(boxes.map(box => box.id === data.id ? { ...box, ...data } : box));
  };

  const startLine = (startBoxId: any, startX: any, startY: any) => {
    setIsDrawingLine(true);
    setCurrentLine({ startBoxId, startX, startY, endX: startX, endY: startY, style: lineStyle } as any);
  };

  const calculatePath = (start: any, end: any, obstacles: any) => {
    // Implementa aquí la lógica del algoritmo de búsqueda de caminos
    // 'obstacles' es un array de objetos que representan los cuadros UML con sus posiciones y dimensiones
    // 'start' y 'end' son objetos que representan los puntos de inicio y fin de la línea

    // Esta es una implementación simplificada y ficticia
    return [{ x: start.x, y: start.y }, { x: end.x, y: end.y }]; // Un camino directo como ejemplo
  };
  const createUMLClass = async (className:any, properties:any) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          className,
          properties, // Esto debe ser un array de objetos, cada uno con {name, type, initializer}
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.error('Error al generar la clase');
      }
    } catch (error) {
      console.error('Error al conectar con la API', error);
    }
  };
  
  const finishLine = (endBoxId: string, endX: number, endY: number) => {
    if (!isDrawingLine || !currentLine || currentLine.startBoxId === endBoxId) return;

    // Encuentra los cuadros de inicio y fin
    const startBox = boxes.find(box => box.id === currentLine.startBoxId);
    const endBox = boxes.find(box => box.id === endBoxId);

    if (startBox && endBox) {
      let startX, startY, finalEndX, finalEndY;

      // Ajusta el punto de inicio y fin de la línea basado en la posición relativa de los cuadros
      if (startBox.initialPosition.x < endBox.initialPosition.x) {
        // El cuadro de inicio está a la izquierda del cuadro final
        startX = startBox.initialPosition.x + startBox.initialWidth;
        startY = startBox.initialPosition.y + startBox.initialHeight / 2;
        finalEndX = endBox.initialPosition.x;
        finalEndY = endBox.initialPosition.y + endBox.initialHeight / 2;
      } else {
        // El cuadro de inicio está a la derecha del cuadro final
        startX = startBox.initialPosition.x;
        startY = startBox.initialPosition.y + startBox.initialHeight / 2;
        finalEndX = endBox.initialPosition.x + endBox.initialWidth;
        finalEndY = endBox.initialPosition.y + endBox.initialHeight / 2;
      }
      const grid = new Grid(100, 100); // Dimensiones basadas en el tamaño de tu área de dibujo
      boxes.forEach((box) => {
        // Marca los nodos ocupados por las cajas como no transitables
        const startX = Math.floor(box.initialPosition.x / 10);
        const endX = Math.ceil((box.initialPosition.x + box.initialWidth) / 10);
        const startY = Math.floor(box.initialPosition.y / 10);
        const endY = Math.ceil((box.initialPosition.y + box.initialHeight) / 10);
        for (let x = startX; x <= endX; x++) {
          for (let y = startY; y <= endY; y++) {
            grid.setWalkableAt(x, y, false);
          }
        }
      });

      // Ajusta la posición final de la línea para evitar solapamientos
      const newLine = {
        ...currentLine,
        startX,
        startY,
        endBoxId,
        endX: finalEndX,
        endY: finalEndY,
        style: lineStyle,
      };

      setLines([...lines, newLine]);
      setIsDrawingLine(false);
      setCurrentLine(null);
      // Llama a handleLineDrawing para encontrar un camino sin obstáculos entre los cuadros UML
      handleLineDrawing(currentLine.startBoxId, endBoxId);
    }
  };

  const handleLineDrawing = (startBoxId: string, endBoxId: string) => {
    const startBox = boxes.find(box => box.id === startBoxId);
    const endBox = boxes.find(box => box.id === endBoxId);

    if (startBox && endBox) {
      const start = { x: startBox.initialPosition.x + startBox.initialWidth / 2, y: startBox.initialPosition.y + startBox.initialHeight / 2 };
      const end = { x: endBox.initialPosition.x + endBox.initialWidth / 2, y: endBox.initialPosition.y + endBox.initialHeight / 2 };

      const grid = new Grid(100, 100); // Ajusta según el tamaño de tu área de dibujo
      boxes.forEach((box) => {
        const startX = Math.floor(box.initialPosition.x / 10);
        const endX = Math.ceil((box.initialPosition.x + box.initialWidth) / 10);
        const startY = Math.floor(box.initialPosition.y / 10);
        const endY = Math.ceil((box.initialPosition.y + box.initialHeight) / 10);
        for (let x = startX; x <= endX; x++) {
          for (let y = startY; y <= endY; y++) {
            grid.setWalkableAt(x, y, false);
          }
        }
      });

      const finder = new AStarFinder();
      const path = finder.findPath(
        Math.floor(start.x / 10), Math.floor(start.y / 10),
        Math.floor(end.x / 10), Math.floor(end.y / 10),
        grid
      );

      if (path.length > 0) {
        const adjustedPath = path.map(coord => ({
          x: coord[0] * 10, // Ajusta según el tamaño de tu cuadrícula
          y: coord[1] * 10,
        }));

        setLines([...lines, { startBoxId, endBoxId, path: adjustedPath, style: lineStyle }]);
      }
    }
  };


  const handleBoxClick = isLineModeEnabled ? (e: React.MouseEvent, boxId: string) => {
    const svgRect = svgRef.current?.getBoundingClientRect();
    const x = e.clientX - (svgRect?.left ?? 0);
    const y = e.clientY - (svgRect?.top ?? 0);
    e.preventDefault();
    e.stopPropagation();
    if (!isLineModeEnabled) return;

    if (!isLineModeEnabled) {
      setLineStartPoint({ x, y });
      setIsDrawingLine(true);
      const box = boxes.find(box => box.id === boxId);
      if (box) {
        const { initialPosition: { x, y } } = box;
        startLine(boxId, x, y);
      }
    } else {
      finishLine(boxId, x, y);
    }
  } : null;

  const toggleLineMode = () => {
    setIsLineModeEnabled(!isLineModeEnabled);
  };
  const toggZoomMode = () => {
    setIsZoomModeEnabled(!isZoomModeEnabled);
  };
  // Función para manejar la adición de puntos de control a las líneas
  const handleLineClick = (lineIndex: number) => {
    const line: any = lines[lineIndex];
    if (!line.controlX || !line.controlY) {
      // Agrega un punto de control en el centro de la línea si no existe uno
      const controlX = (line.startX + line.endX) / 2;
      const controlY = (line.startY + line.endY) / 2 - 50; // Desplaza el control hacia arriba para crear una curva
      const updatedLine = { ...line, controlX, controlY };
      const updatedLines = [...lines];
      updatedLines[lineIndex] = updatedLine;
      setLines(updatedLines);
    }
  };
  useEffect(() => {
    setIsLoading(true); 
    fetch('/api/scantwo')
      .then((response) => response.json())
      .then((data) => {
        setFolders(data);
        
        setIsLoading(false); // Finaliza la carga
      })
      .catch((error) => console.error('Error al traer los folders:', error));
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <NodeList folders={folders} isLoading={isLoading} onAddBox={addBox}/>
      <svg ref={svgRef} width="800" height="600" style={{ border: '1px solid black' }}>
        <g ref={zoomRef}>
          {boxes.map(box => (
            <UMLBox
              key={box.id}
              {...box}
              id={box.id}
              initialPosition={box.initialPosition}
              initialWidth={box.initialWidth}
              initialHeight={box.initialHeight}
              onPositionChange={handlePositionChange}
              onDoubleClick={() => handleDoubleClick(box.id)}
              onSizeChange={handleSizeChange}
              onTextChange={handleTextChange}
              onUpdate={updateBox}
              onClick={handleBoxClick}
            />
          ))}
          {lines.map((line, index) => (
            <Line
              key={index}
              startX={line.startX}
              startY={line.startY}
              endX={line.endX}
              endY={line.endY}
              controlX={line.controlX}
              controlY={line.controlY}
              style={line.style}
              color={line.color} startBoxId={''} endBoxId={''} path={[]} />
          ))}
          {currentLine && <Line {...currentLine} />}
        </g>
      </svg>

      <ToolPalette onAddBox={addBox} onChangeLineStyle={changeLineStyle} onToggleLineMode={toggleLineMode} isLineModeActive={!isLineModeEnabled} onToggleZoomMode={toggZoomMode} isZoomModeActive={isZoomModeEnabled} />
    </div>
  );
};

export default UMLCanvas;