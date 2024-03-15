// class-edit.dto.ts
export class ClassEditDto {
    filePath!: string;
    className!: string;
    changes!: ClassChange[];
  }
  
  export class ClassChange {
    type!: 'addMethod' | 'editMethod' | 'deleteMethod' | 'addProperty' | 'editProperty' | 'deleteProperty';
    name!: string;
    newName?: string;
    // Agrega otros campos según sea necesario, por ejemplo, parámetros para métodos
  }
  