// pages/api/generate-class.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Project } from 'ts-morph';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Desestructura los datos necesarios del cuerpo de la solicitud
  const { className, properties } = req.body;

  // Inicializa ts-morph Project
  const project = new Project();

  // Crea un archivo fuente con el nombre de la clase
  const sourceFile = project.createSourceFile(`${className}.ts`, '', { overwrite: true });

  // Agrega una clase al archivo fuente con las propiedades proporcionadas
  sourceFile.addClass({
    name: className,
    properties: properties.map((prop:any) => ({
      name: prop.name,
      type: prop.type,
      initializer: prop.initializer,
    })),
    isExported: true,
  });

  // Guarda el archivo fuente
  sourceFile.saveSync();

  // Responde con un mensaje de éxito
  res.status(200).json({ message: `Clase ${className} generada exitosamente.` });
}
