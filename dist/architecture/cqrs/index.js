"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCQRSstructure = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CreateCQRSstructure {
    doAlgorithm() {
        const baseDir = path_1.default.join(process.cwd(), 'cqrs-architecture');
        const components = ['commands', 'queries', 'events', 'models'];
        components.forEach(component => {
            const componentDir = path_1.default.join(baseDir, component);
            fs_1.default.mkdirSync(componentDir, { recursive: true });
            fs_1.default.writeFileSync(path_1.default.join(componentDir, `example${component}.ts`), `// Ejemplo básico para ${component}`);
        });
        console.log('Estructura CQRS creada en:', baseDir);
    }
}
exports.CreateCQRSstructure = CreateCQRSstructure;
