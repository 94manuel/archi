import React, { useState } from 'react';
import { IFile, IFolder } from './Interfaces';



const FileIcon: React.FC<{ type: string }> = ({ type }) => {
  const iconPath = `/icons/${type}.png`; // Asume una carpeta 'icons' en tu directorio público con imágenes para cada tipo
  return <img src={iconPath} alt={type} style={{ width: '20px', marginRight: '5px' }} />;
};

const FolderComponent: React.FC<{ folder: IFolder,  AddBox: (title:string, topText: any[], bottomText: any[]) => void }> = ({ folder, AddBox}) => {
  const [isExpanded, setIsExpanded] = useState(false); // Estado para controlar la expansión de los subdirectorios

  const toggleExpansion = () => setIsExpanded(!isExpanded); // Función para cambiar el estado de expansión
  const handleFileClick = (file: IFile) => {
    
    console.log('Hola');
    console.log(file);
    if (file.classes && file.classes.length === 1) {
      AddBox(`${file.classes[0].name}`, file.classes[0].properties.map((e)=> e.name), file.classes[0].methods.map((e)=> e.name));
    } else if (file.classes && file.classes.length > 1) {
      file.classes.forEach((cls) => AddBox(`Clase en ${file.name}: ${cls.name}`, file.classes[0].properties.map((e)=> e.name), file.classes[0].methods.map((e)=> e.name)));
    }
  }; // Función para cambiar el estado de expansión

  return (
    <li>
      <div onClick={()=>{folder.type === 'file' ? handleFileClick(folder as IFile) : toggleExpansion()}} style={{ cursor: 'pointer' }}> {/* Hacer que el nombre del directorio sea clickable */}
        <FileIcon type={folder.type} />
        {folder.name}
      </div>
      {isExpanded && ( // Solo mostrar cuando el directorio está expandido
        <ul>
          {folder.children && folder.children.map((subFolder) => (
            <FolderComponent key={subFolder.name} folder={subFolder} AddBox={AddBox} />
          ))}
          {folder.files && folder.files.map((file) => (
            <li key={file.name}>
              <FileIcon type="file" />
              {file.name}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default FolderComponent;
