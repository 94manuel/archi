import * as fs from 'fs';
import * as path from 'path';
import { Project, ClassDeclaration } from 'ts-morph';

export class ClassEditorService {
  private project: Project;

  constructor() {
    this.project = new Project({});
  }

  async editClass(filePath: string, className: string, changes: ClassChange[]): Promise<boolean> {
    // Asegúrate de que la ruta del archivo es absoluta
    const absoluteFilePath = path.resolve(__dirname, filePath);

    // Verifica que el archivo existe antes de intentar editarlo
    if (!fs.existsSync(absoluteFilePath)) {
        console.error(`El archivo ${absoluteFilePath} no existe.`);
        return false;
    }
    
    const sourceFile = this.project.addSourceFileAtPath(filePath);
    const classToEdit = sourceFile.getClass(className);

    if (!classToEdit) {
      console.error(`La clase ${className} no se encontró en el archivo ${filePath}.`);
      return false;
    }

    changes.forEach(change => {
      switch (change.type) {
        case 'addMethod':
          this.addMethod(classToEdit, change);
          break;
        case 'editMethod':
          this.editMethod(classToEdit, change);
          break;
        case 'deleteMethod':
          this.deleteMethod(classToEdit, change.name);
          break;
        case 'addProperty':
          this.addProperty(classToEdit, change);
          break;
        case 'editProperty':
          this.editProperty(classToEdit, change);
          break;
        case 'deleteProperty':
          this.deleteProperty(classToEdit, change.name);
          break;
        // Agrega más casos para diferentes tipos de cambios si es necesario
      }
    });
    const newFilePath = this.generateNewFilePath(absoluteFilePath);

    try {
        console.log(filePath)
        console.log(await sourceFile.save())
    } catch (error) {
        console.error('Error al guardar el archivo:', error);
        return false;
    }

    return true;
  }

  private addMethod(classDeclaration: ClassDeclaration, change: MethodChange) {
    console.log("Editando...")
    classDeclaration.addMethod({
      name: change.name,
      parameters: change.parameters || [],
      returnType: change.returnType || 'void',
      bodyText: change.bodyText || '',
    });
  }

  private editMethod(classDeclaration: ClassDeclaration, change: MethodChange) {
    const method = classDeclaration.getMethod(change.name);
    if (method) {
      if (change.newName) method.rename(change.newName);
      // Aquí puedes agregar más lógica para editar otros aspectos del método
    }
  }

  private deleteMethod(classDeclaration: ClassDeclaration, methodName: string) {
    const method = classDeclaration.getMethod(methodName);
    method?.remove();
  }

  private addProperty(classDeclaration: ClassDeclaration, change: PropertyChange) {
    classDeclaration.addProperty({
      name: change.name,
      type: change.propertyType,
      initializer: change.initializer,
      
    });
  }

  private editProperty(classDeclaration: ClassDeclaration, change: PropertyChange) {
    const property = classDeclaration.getProperty(change.name);
    if (property) {
      if (change.newName) property.rename(change.newName);
      // Aquí puedes agregar más lógica para editar otros aspectos de la propiedad
    }
  }

  private deleteProperty(classDeclaration: ClassDeclaration, propertyName: string) {
    const property = classDeclaration.getProperty(propertyName);
    property?.remove();
  }

  private generateNewFilePath(originalFilePath: string): string {
    const dirName = path.dirname(originalFilePath);
    const extName = path.extname(originalFilePath);
    const baseName = path.basename(originalFilePath, extName);
    const timestamp = new Date().getTime(); // Usar un timestamp para asegurar un nombre único
    return path.join(dirName, `${baseName}-${timestamp}${extName}`);
  }
}

interface ClassChange {
  type: string; // 'addMethod', 'editMethod', 'deleteMethod', 'addProperty', 'editProperty', 'deleteProperty'
  name: string; // Nombre existente del método o propiedad
  newName?: string; // Nuevo nombre para el método o propiedad (para operaciones de edición)
  // Define otros campos necesarios para tu lógica de cambios
}

interface MethodChange extends ClassChange {
  returnType?: string;
  parameters?: { name: string; type: string }[];
  bodyText?: string;
}

interface PropertyChange extends ClassChange {
  propertyType?: string;
  initializer?: string;
}

// Uso de ClassEditorService...
