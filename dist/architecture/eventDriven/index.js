"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventDrivenStructure = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CreateEventDrivenStructure {
    doAlgorithm() {
        const baseDir = path_1.default.join(process.cwd(), 'event-driven-architecture');
        const components = ['events', 'eventHandlers', 'aggregates'];
        components.forEach(component => {
            const componentDir = path_1.default.join(baseDir, component);
            fs_1.default.mkdirSync(componentDir, { recursive: true });
            fs_1.default.writeFileSync(path_1.default.join(componentDir, `example${component}.ts`), `// Ejemplo básico para ${component}`);
        });
        console.log('Estructura Orientada a Eventos creada en:', baseDir);
    }
}
exports.CreateEventDrivenStructure = CreateEventDrivenStructure;
