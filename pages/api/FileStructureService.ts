import { NextApiRequest, NextApiResponse } from 'next';
import { Project, Directory, SourceFile } from 'ts-morph'; // Importar Directory para manejar directorios

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const project = getProject("./tsconfig.json"); // Ajustamos para manejar solo tsConfigPath
    const fileStructureService = new FileStructureService(project);
    const structure = fileStructureService.getStructure(); // Cambiamos el nombre a getStructure para reflejar mejor la funcionalidad

    res.status(200).json(structure);
}

export function getProject(tsConfigPath?: string) {
    const project = new Project({
        tsConfigFilePath: tsConfigPath
    });
    return project;
}

// file-structure.service.ts
interface ItemDetails {
    name: string;
    type: 'file' | 'folder'; // Tipo para distinguir entre archivo y carpeta
    children?: ItemDetails[]; // Los elementos hijos, relevantes para las carpetas
}

class FileStructureService {
    constructor(private project: Project) {}

    public getStructure(): ItemDetails[] {
        const rootDirs = this.project.getRootDirectories();
        return rootDirs.map(dir => this.processDirectory(dir));
    }

    private processDirectory(directory: Directory): ItemDetails {
        return {
            name: directory.getBaseName(),
            type: 'folder',
            children: [...directory.getDirectories().map(subDir => this.processDirectory(subDir)), ...directory.getSourceFiles().map(file => this.processFile(file))]
        };
    }

    private processFile(file: SourceFile): ItemDetails {
        return {
            name: file.getBaseName(),
            type: 'file'
            // Aquí podrías expandir para incluir más detalles sobre el archivo, si es necesario
        };
    }
}
