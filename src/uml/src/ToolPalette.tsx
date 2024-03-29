import React from 'react';

const ToolPalette: React.FC<{
  onAddBox: () => void,
  onChangeLineStyle: (style: string) => void,
  onToggleLineMode: () => void // Nuevo prop para manejar el modo de dibujo de líneas
  isLineModeActive: boolean
}> = ({ onAddBox, onChangeLineStyle, onToggleLineMode, isLineModeActive  }) => {
  return (
    <div className="tool-palette" style={{ padding: '10px', border: '1px solid #ccc', marginLeft: '20px' }}>
      <h3>Herramientas UML</h3>
      <button onClick={onAddBox}>Agregar Cuadro UML</button>
      <div>
        <label>Estilo de Línea:</label>
        <select onChange={(e) => onChangeLineStyle(e.target.value)}>
          <option value="solid">Sólida</option>
          <option value="dotted">Punteada</option>
          <option value="dashed">Rayada</option>
        </select>
      </div>
      <button onClick={onToggleLineMode}>{isLineModeActive ? "Desactivar" : "Activar"} Modo de Dibujo de Líneas</button>
    </div>
  );
};

export default ToolPalette;