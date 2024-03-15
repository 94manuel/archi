// Interfaces.ts
// Asumiendo la definición de las interfaces IFolder e IFile
export interface IFolder {
  name: string;
  path: string;
  type: string;
  children: IFolder[];
  files: IFile[];
}

export interface IClass {
  name: string;
  // Agrega más propiedades según sea necesario
}

export interface IFile {
  name: string;
  path: string;
  type: string;
  classes?: IClass[];
  // Otras propiedades específicas de archivos...
}