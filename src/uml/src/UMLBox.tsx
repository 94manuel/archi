import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.min.css';
export interface Point { x: number; y: number; }
export interface Dimensions { width: number; height: number }

export interface UMLBoxProps {
    id: string;
    initialPosition: Point;
    initialWidth: number;
    initialHeight: number;
    topText: string[]; // Texto para la parte superior
    bottomText: string[];
    type: string;
    title: string;
    onPositionChange?: (id: string, newPosition: Point) => void;
    onSizeChange?: (id: string, newWidth: number, newHeight: number) => void;
    onTextChange?: (id: string, newText: string[]) => void;
    onUpdate: (data: { id: string; position: Point; dimensions: Dimensions; text: string[] }) => void;
    onClick: any,
    onDoubleClick: any
}
type BoxColors = {
    [key: string]: string;
};
const UMLBox: React.FC<UMLBoxProps> = ({
    id,
    initialPosition,
    initialWidth,
    initialHeight,
    topText,
    bottomText,
    type,
    title,
    onPositionChange,
    onSizeChange,
    onTextChange,
    onUpdate,
    onDoubleClick
}) => {
    const [position, setPosition] = useState<Point>(initialPosition);
    const [dimensions, setDimensions] = useState<Dimensions>({ width: initialWidth, height: initialHeight });
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const boxRef = useRef<SVGGElement>(null);
    const resizeHandleRef = useRef<SVGRectElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [topTextState, setTopText] = useState<string[]>(topText);
    const [bottomTextState, setBottomText] = useState<string[]>(bottomText);
    const boxColors:BoxColors  = {
        clase: 'blue',
        interfaz: 'green',
        // Agrega otros tipos de cuadro y sus colores aquí
    };

    useEffect(() => {
        if (!boxRef.current) return;
        const drag = d3.drag()
            .on('start', function (event) {
                // Obtiene la posición actual del cuadro antes de comenzar el arrastre
                const { x, y } = event.subject;

                d3.select(this).raise(); // Opcional: Trae al frente el cuadro UML actual al empezar a arrastrarlo

                // Establece el desplazamiento inicial entre la posición del cursor y la posición del cuadro
                if (!boxRef.current) return;
                const rect = boxRef.current.getBoundingClientRect();
                event.subject.dx = event.x - rect.left;
                event.subject.dy = event.y - rect.top;
            })
            .on('drag', (event) => {// Usa el desplazamiento inicial para ajustar la nueva posición del cuadro durante el arrastre
                const newX = event.x - event.subject.dx;
                const newY = event.y - event.subject.dy;
                setPosition({ x: newX, y: newY });
                if (onPositionChange) onPositionChange(id, { x: newX, y: newY });
            });
        d3.select(boxRef.current).call(drag as any);
    }, [initialPosition, onPositionChange]);

    useEffect(() => {
        if (!resizeHandleRef.current) return;
        const dragResize = d3.drag()
            .on('start', function (event) {
                // Captura la posición inicial del mouse al empezar el arrastre
                const initialMouseX = event.x;
                const initialMouseY = event.y;

                d3.select(this).attr('data-initial-mouse-x', initialMouseX);
                d3.select(this).attr('data-initial-mouse-y', initialMouseY);
            })
            .on('drag', (event) => {
                const initialMouseX = parseFloat(d3.select(resizeHandleRef.current).attr('data-initial-mouse-x'));
                const initialMouseY = parseFloat(d3.select(resizeHandleRef.current).attr('data-initial-mouse-y'));

                // Calcula el cambio en la posición del mouse desde el inicio del arrastre
                const dx = event.x - initialMouseX;
                const dy = event.y - initialMouseY;

                // Ajusta las nuevas dimensiones basándose en el cambio de posición del mouse
                const newWidth = Math.max(50, initialWidth + dx);
                const newHeight = Math.max(50, initialHeight + dy);

                setDimensions({ width: newWidth, height: newHeight });
                onSizeChange && onSizeChange(id, newWidth, newHeight);
            });
        d3.select(resizeHandleRef.current).call(dragResize as any);
    }, [onSizeChange, id]);

    useEffect(() => {
        const updateDimensions = () => {
            const maxWidth = computeMaxWidth([...topTextState, ...bottomTextState, title]);
            const minHeight = computeMinHeight(topTextState, bottomTextState);
            setDimensions({ width: Math.max(initialWidth, maxWidth), height: Math.max(initialHeight, minHeight) });
            onSizeChange && onSizeChange(id, Math.max(initialWidth, maxWidth), Math.max(initialHeight, minHeight));
        };

        updateDimensions();
    },  [topTextState, bottomTextState, title, initialWidth, initialHeight, onSizeChange, id]);
    useEffect(() => {
        if (listRef.current) {
            const listItems = listRef.current.children;
            let totalHeight = 0;
            for (let i = 0; i < listItems.length; i++) {
                const item = listItems[i] as HTMLElement;
                totalHeight += item.getBoundingClientRect().height;
            }

            const newHeight = totalHeight + 20;
            setDimensions(dimensions => ({ ...dimensions, height: Math.max(dimensions.height, newHeight) }));
            onSizeChange && onSizeChange(id, dimensions.width, Math.max(dimensions.height, newHeight));
        }
    }, [topTextState, bottomTextState]); // Dependencias: Asegúrate de incluir todo lo que pueda cambiar el contenido o tamaño de la lista.

    // Función para calcular el ancho máximo requerido por el texto más largo
    const computeMaxWidth = (textArray: string[]) => {
        const charWidth = 8; // Ancho estimado por carácter, depende del tamaño de fuente y la fuente misma
        let maxWidth = 0;
        textArray.forEach(text => {
            const textWidth = text.length * charWidth;
            if (textWidth > maxWidth) {
                maxWidth = textWidth;
            }
        });
        return maxWidth + 30; // Agregar un poco de margen
    };

    const computeMinHeight = (topTextArray: string[], bottomTextArray: string[]) => {
        const itemHeight = 55; // Altura estimada por ítem, ajusta según el tamaño de fuente y el espaciado entre líneas
        const titleHeight = 45; // Espacio asignado para el título, ajusta según sea necesario
        const bottomHeight = 45; // Espacio asignado para el título, ajusta según sea necesario
        // Calcula la altura total basada en el número de elementos en cada lista
        const totalHeight = titleHeight + (topTextArray.length + bottomTextArray.length) * itemHeight + 20 +bottomHeight; // 20px para padding adicional
        return totalHeight;
    };

    const handleAddTopText = () => {
        const newTopTextState = [...topTextState, ""];
        setTopText(newTopTextState);
    };

    const handleAddBottomText = () => {
        const newBottomTextState = [...bottomTextState, ""];
        setBottomText(newBottomTextState);
    };

    const handleTopTextChange = (index: number, value: string) => {
        const newItems = [...topTextState];
        newItems[index] = value;
        setTopText(newItems);
    };

    const handleBottomTextChange = (index: number, value: string) => {
        const newItems = [...bottomTextState];
        newItems[index] = value;
        setBottomText(newItems);
    };

    return (
        <g ref={boxRef} transform={`translate(${initialPosition.x}, ${initialPosition.y})`} cursor="move"
            onDoubleClick={(e) => {
                e.stopPropagation(); // Evita la propagación adicional del evento
                onDoubleClick?.(id); // Llama al manejador de doble clic con el ID del cuadro
            }}
        >
            <rect
                width={initialWidth}
                height={initialHeight}
                fill={boxColors[type] || 'blue'}
            />
            {/* Título */}
            <text x="5%" y="30" fill="black" textAnchor="middle" dominantBaseline="middle" fontSize="20">{title}</text>
            {/* Línea debajo del título */}
            <line x1="0" y1="40" x2={dimensions.width} y2="40" stroke="black" strokeWidth="2" />

            {/* Line to divide the box in half */}
            <line x1="0" y1={dimensions.height / 2} x2={dimensions.width} y2={dimensions.height / 2} stroke="black" strokeWidth="2" />

            {/* Top half for text */}
            <foreignObject width={dimensions.width} height={dimensions.height / 2}>
                <div style={{ width: '100%', height: '100%', overflow: 'auto', color: 'white' }}>
                    <ul ref={listRef} style={{  listStyle: 'none', padding: 0, margin: 0 }} >
                        {topTextState.map((item, index) => (
                            <li key={index}>
                                <textarea value={item} onChange={(e) => handleTopTextChange(index, e.target.value)} style={{ width: '90%', resize: 'none', border: 'none', background: 'transparent', color: 'white', overflow: 'hidden' }} />
                            </li>
                        ))}
                        <li key={9999}>
                            <button onClick={handleAddTopText}>+</button>
                        </li>
                    </ul>
                </div>
            </foreignObject>
            {/* Bottom half for text */}
            <foreignObject x="0" y={dimensions.height / 2} width={dimensions.width} height={dimensions.height / 2}>
                <div style={{ width: '100%', height: '100%', overflow: 'auto', color: 'white' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {bottomTextState.map((item, index) => (
                            <li key={index}>
                                <textarea value={item} onChange={(e) => handleBottomTextChange(index, e.target.value)} style={{ width: '90%', resize: 'none', border: 'none', background: 'transparent', color: 'white', overflow: 'hidden' }} />
                            </li>
                        ))}
                        <button onClick={handleAddBottomText}>+</button>
                    </ul>
                </div>
            </foreignObject>
            {/* Manejador de redimensionamiento */}
            <rect
                ref={resizeHandleRef}
                x={dimensions.width - 10}
                y={dimensions.height - 10}
                width="10"
                height="10"
                fill="red"
                cursor="nwse-resize"
            />
        </g>
    );
};

export default UMLBox;
