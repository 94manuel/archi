import { useEffect, useRef, useState } from "react";
import { Point } from "../UMLBox.client";
import { LineStyle } from "../redux/features/lines/lines";
import * as d3 from "d3";

export interface LineProps {
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
    onDelete: () => void; 
  }

const Line: React.FC<LineProps> = ({
    startX,
    startY,
    endX,
    endY,
    controlX,
    controlY,
    style,
    initialColor = 'black', selectedColor = 'red', onDelete 
  }) => {
    const [isSelected, setIsSelected] = useState(false);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [controlPoint, setControlPoint] = useState({ controlX: null, controlY: null });

    const ref = useRef(null);
  
    useEffect(() => {
      const svg = d3.select(ref.current);
      svg.selectAll('*').remove(); // Limpia el contenedor antes de dibujar
  
      let d: string;
      if (controlPoint.controlX !== null && controlPoint.controlY !== null) {
        // Dibuja una curva cuadrática si existe un punto de control
        d = `M ${startX} ${startY} Q ${controlPoint.controlX} ${controlPoint.controlY} ${endX} ${endY}`;
      } else {
        // Dibuja una línea recta en caso contrario
        d = `M ${startX} ${startY} L ${endX} ${endY}`;
      }
  
      const path = svg.append('path')
        .attr('d', d)
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
          setControlPoint({ controlX: x, controlY: y });
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
    
    // El componente refiere a un contenedor SVG. La línea se dibujará dentro de este contenedor
    return <g ref={ref} />;
  };
export default Line;
  