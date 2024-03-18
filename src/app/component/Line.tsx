import { useEffect, useRef, useState } from "react";
import { Point } from "../UMLBox.client";
import { LineStyle, deleteLine } from "../redux/features/lines/lines";
import * as d3 from "d3";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { AStarFinder, Grid } from "pathfinding";

export interface LineProps {
    id: string;
    startBoxId: string;
    endBoxId: string;
    path: Point[];
    startX?: number;
    startY?: number;
    endX?: number;
    endY?: number;
    style: LineStyle;
    controlX?: number;
    controlY?: number;
    color?: string;
    initialColor?: string;
    selectedColor?: string;
  }

const Line: React.FC<LineProps> = ({
    id,
    startX,
    startY,
    endX,
    endY,
    controlX,
    controlY,
    style,
    initialColor = 'black', selectedColor = 'red' 
  }) => {
    const [isSelected, setIsSelected] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [controlPoint, setControlPoint] = useState([]);
    const umlBoxes = useSelector((state: RootState) => state.uml.value);
    const dispatch = useDispatch();
    const finder = new AStarFinder();

    const ref = useRef(null);
  
    useEffect(() => {
      const svg = d3.select(ref.current);
      svg.selectAll('*').remove(); // Limpia el contenedor antes de dibujar

      const grid = new Grid(150, 150);

      // Marca las celdas del grid que están ocupadas por UMLBoxes como no transitables
      umlBoxes.forEach(box => {
        const xStart = Math.floor(box.x / 10);
        const yStart = Math.floor(box.y / 10);
        const xEnd = Math.ceil((box.x + box.width) / 10);
        const yEnd = Math.ceil((box.y + box.height) / 10);
  
        for (let x = xStart; x <= xEnd; x++) {
          for (let y = yStart; y <= yEnd; y++) {
            grid.setWalkableAt(x, y, false);
          }
        }
      });

      // Usa A* para encontrar la ruta
      const ruta = finder.findPath(
        Math.floor(startX / 10), Math.floor(startY / 10),
        Math.floor(endX / 10), Math.floor(endY / 10),
        grid.clone()
      );

      // Convierte la ruta de vuelta a coordenadas del lienzo
      const lineData = ruta.map(point => ({
        x: point[0] * 10, // Ajusta esto según tu escala
        y: point[1] * 10,
      }));

      // Dibuja la línea basándote en la ruta calculada
      const lineFunction = d3.line()
      .x(d => d.x)
      .y(d => d.y);

      let d: any;
      d = `M ${startX} ${startY}`;
      controlPoint.forEach(point => {
        d += ` L ${point.x} ${point.y}`;
      });
      d += ` L ${endX} ${endY}`;
  
      const path = svg.append('path')
        //.attr('d',  lineFunction(lineData as any))
        .attr('d',  lineFunction(lineData as any))
        .attr('stroke', isSelected ? selectedColor : initialColor)
        .attr('stroke-width', '3')
        .attr('fill', 'none')
        .attr('stroke-dasharray', style)
        .style('cursor', 'pointer'); // Cambia el puntero al pasar por encima
  
        path.on('click', () => {
          setIsSelected(!isSelected);
          setShowDeleteButton(!showDeleteButton);
        });
        path.on('dblclick', (event) => {
          const [x, y] = d3.pointer(event);
          console.log("Dobleclick")
          setControlPoint([...controlPoint, { x, y }]);
        });
        controlPoint.forEach(point => {
          svg.append('circle')
            .attr('cx', point.x)
            .attr('cy', point.y)
            .attr('r', 5)
            .attr('fill', 'red');
        });
        if (showDeleteButton) {
          svg.append('text')
            .attr('x', (startX + endX) / 2)
            .attr('y', (startY + endY) / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', 'red')
            .style('cursor', 'pointer')
            .text('X')
            .on('click', onDelete);
        }
      }, [startX, startY, endX, endY, controlX, controlY, style, initialColor, selectedColor, isSelected]);

    const onDelete = () => {
      dispatch(deleteLine(id))
    }
    // El componente refiere a un contenedor SVG. La línea se dibujará dentro de este contenedor
    return <g ref={ref} />;
  };
export default Line;
  