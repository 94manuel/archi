import { NextApiRequest, NextApiResponse } from 'next';
import { Project, Directory, SourceFile, PropertyDeclaration, MethodDeclaration, FunctionDeclaration, ParameterDeclaration, ClassDeclaration, InterfaceDeclaration } from 'ts-morph'; // Importar Directory para manejar directorios

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
    classes?: ClassDetails[];
    interfaces?: InterfaceDetails[];
    functions?: FunctionDetails[];
    children?: ItemDetails[];
}
interface FileDeclarations {
  filePath: string;
  classes: ClassDetails[];
  interfaces: InterfaceDetails[];
  functions: FunctionDetails[];
}

interface ClassDetails {
  name: string;
  methods: MethodDetails[];
  properties: PropertyDetails[];
}

interface InterfaceDetails {
  name: string;
  methods: MethodDetails[];
}

interface FunctionDetails {
  name: string;
  returnType: string;
  parameters: ParameterDetails[];
}

interface MethodDetails {
  name: string;
  returnType: string;
  parameters: ParameterDetails[];
}

interface PropertyDetails {
  name: string;
  type: string;
}

interface ParameterDetails {
  name: string;
  type: string;
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
            type: 'file',
            classes: file.getClasses().map(c => this.processClass(c)),
            interfaces: file.getInterfaces().map(i => this.processInterface(i)),
            functions: file.getFunctions().map(f => this.processFunction(f))
            // Aquí podrías expandir para incluir más detalles sobre el archivo, si es necesario
        };
    }
    private processClass(classDeclaration: ClassDeclaration): ClassDetails {
      return {
        name: classDeclaration.getName() || 'UnnamedClass',
        methods: classDeclaration.getMethods().map(m => this.processMethod(m)),
        properties: classDeclaration.getProperties().map(p => this.processProperty(p)),
      };
    }
  
    private processInterface(interfaceDeclaration: InterfaceDeclaration): InterfaceDetails {
      return {
        name: interfaceDeclaration.getName(),
        methods: interfaceDeclaration.getMethods().map(m => this.processMethod(m as any)),
      };
    }
  
    private processFunction(functionDeclaration: FunctionDeclaration): FunctionDetails {
      return {
        name: functionDeclaration.getName() || 'UnnamedFunction',
        returnType: functionDeclaration.getReturnType().getText(),
        parameters: functionDeclaration.getParameters().map(p => this.processParameter(p)),
      };
    }
  
    private processMethod(methodDeclaration: MethodDeclaration): MethodDetails {
      return {
        name: methodDeclaration.getName(),
        returnType: methodDeclaration.getReturnType().getText(),
        parameters: methodDeclaration.getParameters().map(p => this.processParameter(p)),
      };
    }
  
    private processProperty(propertyDeclaration: PropertyDeclaration): PropertyDetails {
      return {
        name: propertyDeclaration.getName(),
        type: propertyDeclaration.getType().getText(),
      };
    }
  
    private processParameter(parameterDeclaration: ParameterDeclaration): ParameterDetails {
      return {
        name: parameterDeclaration.getName(),
        type: parameterDeclaration.getType().getText(),
      };
    }
}
