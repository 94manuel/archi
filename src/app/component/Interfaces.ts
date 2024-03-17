// Interfaces.ts

import { MethodDetails, PropertyDetails } from "../../../pages/api/model";

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
  methods: MethodDetails[];
  properties: PropertyDetails[];
  // Agrega más propiedades según sea necesario
}

export interface IFile {
  name: string;
  path: string;
  type: string;
  classes?: IClass[];
  // Otras propiedades específicas de archivos...
}