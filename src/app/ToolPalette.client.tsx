"use client"
import React from 'react';

const ToolPalette: React.FC<{
  onAddBox: (title:string, topTextState:any, bottomText: any[]) => void,
  onChangeLineStyle: (style: string) => void,
  onToggleLineMode: () => void,
  onToggleZoomMode: () => void,
  isLineModeActive: boolean,
  isZoomModeActive: boolean
}> = ({ onAddBox, onChangeLineStyle, onToggleLineMode, isLineModeActive, onToggleZoomMode, isZoomModeActive }) => {
  return (
    <div className="tool-palette" style={{ padding: '10px', border: '1px solid #ccc', marginLeft: '20px' }}>
      <h3>Herramientas UML</h3>
      <button onClick={() => onAddBox("ejemplo",[{}],[{}])}>Agregar Cuadro UML</button>
      <div>
        <label>Estilo de Línea:</label>
        <select onChange={(e) => onChangeLineStyle(e.target.value)}>
          <option value="Solid">Sólida</option>
          <option value="Dotted">Punteada</option>
          <option value="Dashed">Rayada</option>
        </select>
      </div>
      <button onClick={onToggleLineMode}>{isLineModeActive ? "Desactivar" : "Activar"} Modo de Dibujo de Líneas</button>
      <button onClick={onToggleZoomMode}>{isZoomModeActive ? "Desactivar" : "Activar"} zoom</button>
    </div>
  );
};

export default ToolPalette;