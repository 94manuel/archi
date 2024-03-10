import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

export interface Point { x: number; y: number; }
export interface Dimensions { width: number; height: number }

export interface UMLBoxProps {
    id: string;
    initialPosition: Point;
    initialWidth: number;
    initialHeight: number;
    topText: string[]; // Texto para la parte superior
    bottomText: string[];
    onPositionChange?: (id: string, newPosition: Point) => void;
    onSizeChange?: (id: string, newWidth: number, newHeight: number) => void;
    onTextChange?: (id: string, newText: string[]) => void;
    onUpdate: (data: { id: string; position: Point; dimensions: Dimensions; text: string[] }) => void;
    onClick: any,
    onDoubleClick: any
}

const UMLBox: React.FC<UMLBoxProps> = ({
    id,
    initialPosition,
    initialWidth,
    initialHeight,
    topText,
    bottomText,
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
    const [topTextState, setTopText] = useState<string[]>(topText);
    const [bottomTextState, setBottomText] = useState<string[]>(bottomText);

    useEffect(() => {
        if (!boxRef.current) return;
        const drag = d3.drag()
            .on('start', function (event) {
                // Obtiene la posición actual del cuadro antes de comenzar el arrastre
                const { x, y } = event.subject;
                console.log("boxRef")
                console.log({ x, y })

                d3.select(this).raise(); // Opcional: Trae al frente el cuadro UML actual al empezar a arrastrarlo

                // Establece el desplazamiento inicial entre la posición del cursor y la posición del cuadro
                event.subject.dx = event.x - x;
                event.subject.dy = event.y - y;
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
            .on('drag', (event) => {

                const newWidth = Math.max(50, event.x - position.x);
                const newHeight = Math.max(50, event.y - position.y);
                setDimensions({ width: newWidth, height: newHeight });
                onSizeChange && onSizeChange(id, newWidth, newHeight);
            });
        d3.select(resizeHandleRef.current).call(dragResize as any);
    }, [onSizeChange, id]);


    const handleAddTopText = () => {
        setTopText([...topTextState, ""]);
    };

    const handleAddBottomText = () => {
        setBottomText([...bottomTextState, ""]);
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
                fill="blue"
            />
            {/* Line to divide the box in half */}
            <line x1="0" y1={dimensions.height / 2} x2={dimensions.width} y2={dimensions.height / 2} stroke="black" strokeWidth="2" />

            {/* Top half for text */}
            <foreignObject width={dimensions.width} height={dimensions.height / 2}>
                <div style={{ width: '100%', height: '100%', overflow: 'auto', color: 'white' }}>
                    <ul style={{  flex: 1, listStyle: 'none', padding: 0, margin: 0 }}>
                        {topTextState.map((item, index) => (
                            <li key={index}>
                                <textarea value={item} onChange={(e) => handleTopTextChange(index, e.target.value)} style={{ width: '90%', resize: 'none', border: 'none', background: 'transparent', color: 'white', overflow: 'hidden' }} />
                            </li>
                        ))}
                        <button onClick={handleAddTopText}>+</button>
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
