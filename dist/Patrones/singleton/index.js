"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSingletonStructure = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CreateSingletonStructure {
    doAlgorithm(pattern) {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path_1.default.join(process.cwd(), "src", pattern.toLowerCase());
        fs_1.default.mkdirSync(rootDir, { recursive: true });
        const srcDir = path_1.default.join(rootDir, 'src');
        fs_1.default.mkdirSync(srcDir, { recursive: true });
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
        const singletonFilePath = path_1.default.join(srcDir, 'singleton.ts');
        fs_1.default.writeFileSync(singletonFilePath, singletonContent);
        // Crear archivo index.ts
        const indexFilePath = path_1.default.join(rootDir, 'index.ts');
        fs_1.default.writeFileSync(indexFilePath, indexContent);
        console.log(`Proyecto Singleton creado en ${rootDir}`);
    }
}
exports.CreateSingletonStructure = CreateSingletonStructure;
