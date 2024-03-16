"use client"
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { MethodDetails, PropertyDetails } from '../../pages/api/model';
export interface Point { x: number; y: number; }
export interface Dimensions { width: number; height: number }

export interface UMLBoxProps {
    id: string;
    initialPosition: Point;
    initialWidth: number;
    initialHeight: number;
    topText: PropertyDetails[]; // Texto para la parte superior
    bottomText: MethodDetails[];
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
    const [topTextState, setTopText] = useState<PropertyDetails[]>(topText);
    const [bottomTextState, setBottomText] = useState<MethodDetails[]>(bottomText);
    const [editingIndex, setEditingIndex] = useState<number | null>(null); // Índice del elemento que se está editando
    const [tempText, setTempText] = useState<string>(''); // Texto temporal mientras se edita

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
                //const maxWidth = computeMaxWidth([...topTextState, ...bottomTextState, title]);
                const minHeight = computeMinHeight(topTextState, bottomTextState);

                d3.select(this).attr('data-initial-mouse-x', initialMouseX);
                d3.select(this).attr('data-initial-mouse-y', initialMouseY);
               // updateDimensions();
            })
            .on('drag', (event) => {
                const initialMouseX = parseFloat(d3.select(resizeHandleRef.current).attr('data-initial-mouse-x'));
                const initialMouseY = parseFloat(d3.select(resizeHandleRef.current).attr('data-initial-mouse-y'));

                // Calcula el cambio en la posición del mouse desde el inicio del arrastre
                const dx = event.x - initialMouseX;
                const dy = event.y - initialMouseY;

                // Ajusta las nuevas dimensiones basándose en el cambio de posición del mouse
                //const maxWidth = computeMaxWidth([...topTextState, ...bottomTextState, title]);
                //const minHeight = computeMinHeight(topTextState, bottomTextState);
                const newWidth = Math.max(50, initialWidth + dx);
                const newHeight = Math.max(50, initialHeight + dy);

                setDimensions({ width: newWidth, height: newHeight });
                onSizeChange && onSizeChange(id, newWidth, newHeight);

            });
        d3.select(resizeHandleRef.current).call(dragResize as any);
    }, [onSizeChange, id]);
    const updateDimensions = () => {
       // const maxWidth = computeMaxWidth([...topTextState, ...bottomTextState, title]);
        //const minHeight = computeMinHeight(topTextState, bottomTextState);
       // setDimensions({ width: Math.max(initialWidth, maxWidth), height: Math.max(initialHeight, minHeight) });
       // onSizeChange && onSizeChange(id, Math.max(initialWidth, maxWidth), Math.max(initialHeight, minHeight));
    };
    
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
    const computeMaxWidth = (textArray: PropertyDetails[]) => {
        const charWidth = 8; // Ancho estimado por carácter, depende del tamaño de fuente y la fuente misma
        let maxWidth = 0;
        textArray.forEach(text => {
            const textWidth = text.name.length * charWidth;
            if (textWidth > maxWidth) {
                maxWidth = textWidth;
            }
        });
        return maxWidth + 30; // Agregar un poco de margen
    };

    const computeMinHeight = (topTextArray: PropertyDetails[], bottomTextArray: MethodDetails[]) => {
        const itemHeight = 55; // Altura estimada por ítem, ajusta según el tamaño de fuente y el espaciado entre líneas
        const titleHeight = 45; // Espacio asignado para el título, ajusta según sea necesario
        const bottomHeight = 45; // Espacio asignado para el título, ajusta según sea necesario
        // Calcula la altura total basada en el número de elementos en cada lista
        const totalHeight = titleHeight + (topTextArray.length + bottomTextArray.length) * itemHeight + 20 +bottomHeight; // 20px para padding adicional
        return totalHeight;
    };

    const handleAddTopText = () => {
        const newTopTextState = [...topTextState, "Metodo"];
        //setTopText(newTopTextState);
    };

    const handleAddBottomText = () => {
        const newBottomTextState = [...bottomTextState, ""];
        //setBottomText(newBottomTextState);
    };

    const handleTopTextChange = (index: number, value: string) => {
        const newItems = [...topTextState];
        newItems[index].name = value;
        setTopText(newItems);
    };

    const handleBottomTextChange = (index: number, value: string) => {
        const newItems = [...bottomTextState];
        newItems[index].name = value;
        setBottomText(newItems);
    };

    const handleClose = () => {
        //setIsVisible(false);
    };
    const handleEdit = (index: number, currentText: string) => {
        setEditingIndex(index); // Establece el índice actual como el que se está editando
        setTempText(currentText); // Inicializa el texto temporal con el valor actual
    };

    const handleConfirm = (index: number) => {
        handleTopTextChange(index, tempText); // Actualiza el texto con el valor temporal
        console.log(topTextState[index])
        setEditingIndex(null); // Sale del modo de edición
    };

    const handleCancel = () => {
        setEditingIndex(null); // Simplemente sale del modo de edición sin guardar cambios
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
                fill="white" // Fondo blanco para imitar un diagrama UML
                stroke="black" // Borde negro
            />
            {/* Título (nombre de la clase) */}
            <text x="20%" y="20" fill="black" textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>{title}</text>
            {/* Línea debajo del título */}
            <line x1="0" y1="30" x2={initialWidth} y2="30" stroke="black" strokeWidth="1" />
    
            {/* Línea para dividir los atributos de los métodos */}
            <line x1="0" y1={initialHeight / 2} x2={initialWidth} y2={initialHeight / 2} stroke="black" strokeWidth="1" />
    
            {/* Sección de atributos */}
            <foreignObject width={initialWidth} height={initialHeight / 2 - 30} y="30">
                <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                    <ul ref={listRef} style={{ listStyle: 'none', padding: '10px', margin: '0' }} >
                        {topTextState.map((item, index) => (
                            <li key={index} style={{ marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {editingIndex === index ? (
                                <textarea value={item.name} onChange={(e) => handleTopTextChange(index, e.target.value)} style={{ width: '90%', resize: 'none', border: 'none', background: 'transparent', color: 'white', overflow: 'hidden' }} />
                                ) : (
                                    <span onDoubleClick={() => handleEdit(index, item.name)}>{item.name}</span>
                                )}
                                {editingIndex === index && (
                                    <>
                                        <button onClick={() => handleConfirm(index)} style={{ position: 'absolute', right: 0, top: 0 }}>
                                            Confirmar
                                        </button>
                                        <button onClick={handleCancel} style={{ position: 'absolute', right: 0, bottom: 0 }}>
                                            Cancelar
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                        <li onClick={handleAddTopText} style={{ cursor: 'pointer', color: 'blue' }}>
                            + Agregar Atributo
                        </li>
                    </ul>
                </div>
            </foreignObject>
    
            {/* Sección de métodos */}
            <foreignObject x="0" y={initialHeight / 2} width={initialWidth} height={initialHeight / 2 - 30}>
                <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                    <ul style={{ listStyle: 'none', padding: '10px', margin: '0' }}>
                        {bottomTextState.map((item, index) => (
                            <li key={index} style={{ marginBottom: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {editingIndex === index ? (
                                <textarea value={item.name} onChange={(e) => handleBottomTextChange(index, e.target.value)} style={{ width: '90%', resize: 'none', border: 'none', background: 'transparent', color: 'white', overflow: 'hidden' }} />
                                ) : (
                                    <span onDoubleClick={() => handleEdit(index, item.name)}>{item.name}</span>
                                )}
                                {editingIndex === index && (
                                    <>
                                        <button onClick={() => handleConfirm(index)} style={{ position: 'absolute', right: 0, top: 0 }}>
                                            Confirmar
                                        </button>
                                        <button onClick={handleCancel} style={{ position: 'absolute', right: 0, bottom: 0 }}>
                                            Cancelar
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                        <li onClick={handleAddBottomText} style={{ cursor: 'pointer', color: 'blue' }}>
                            + Agregar Atributo
                        </li>
                    </ul>
                </div>
            </foreignObject>
    
            {/* Manejador de redimensionamiento */}
            <rect
                ref={resizeHandleRef}
                x={initialWidth - 10}
                y={initialHeight - 10}
                width="10"
                height="10"
                fill="gray" // Color gris para el manejador de redimensionamiento
                cursor="nwse-resize"
            />
            {/* Botón de eliminar/cerrar */}
            <text
                x={dimensions.width - 15} // Posición X cerca del borde derecho
                y="15" // Posición Y cerca del borde superior
                fill="red" // Color rojo para la "X"
                cursor="pointer" // Cambia el cursor a pointer
                onClick={handleClose}
                onMouseEnter={() => console.log('Cerrar UML')} // Muestra un mensaje en consola al pasar el mouse (ajusta según necesidad)
            >
                &#x2715; {/* Símbolo de "X" */}
            </text>
        </g>
    );
    
};

export default UMLBox;
