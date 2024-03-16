// NodeList.tsx
import React from 'react';
import { IFolder } from './Interfaces';
import FolderComponent from './FolderComponent';
import './NodeList.css';

interface NodeListProps {
  folders: IFolder[];
  isLoading: boolean;
  onAddBox: (title:string, topText: any[], bottomText: any[]) => void;
}

const NodeList: React.FC<NodeListProps> = ({ folders, isLoading, onAddBox }) => {

  if (isLoading) {
    return <div>Cargando...</div>; // O puedes usar un spinner o cualquier otro indicador de carga aquí
  }
  return (
    <div className="nodeList">
      <ul>
        {folders.map((folder:IFolder) => (
          <FolderComponent key={folder.path} folder={folder} AddBox={onAddBox}/>
        ))}
      </ul>
    </div>
  );
};

export default NodeList;