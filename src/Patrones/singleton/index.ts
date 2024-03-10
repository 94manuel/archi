import path from 'path';
import fs from 'fs';

export class CreateSingletonStructure implements IPatternsStrategy {
    doAlgorithm(pattern:string): void {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path.join(process.cwd(), "src", pattern.toLowerCase());
        fs.mkdirSync(rootDir, { recursive: true });
        const srcDir = path.join(rootDir, 'src');
        fs.mkdirSync(srcDir, { recursive: true });
        
        const singletonContent = `class Singleton {
            private static instance: Singleton;
          
            private constructor() {}
          
            public static getInstance(): Singleton {
              if (!Singleton.instance) {
                Singleton.instance = new Singleton();
              }
          
              return Singleton.instance;
            }
          }
          
          export default Singleton;
          `;
        
        const indexContent = `import Singleton from './src/singleton';
        
        const instance1 = Singleton.getInstance();
        const instance2 = Singleton.getInstance();
        
        console.log(instance1 === instance2);  // Debería imprimir 'true'
        `;
        
      // Crear archivo singleton.ts
      const singletonFilePath = path.join(srcDir, 'singleton.ts');

      fs.writeFileSync(singletonFilePath, singletonContent);

      // Crear archivo index.ts
      const indexFilePath = path.join(rootDir, 'index.ts');

      fs.writeFileSync(indexFilePath, indexContent);
      console.log(`Proyecto Singleton creado en ${rootDir}`);
    }
    
}