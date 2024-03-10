"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLayeredStructure = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CreateLayeredStructure {
    doAlgorithm() {
        const baseDir = path_1.default.join(process.cwd(), 'layered-architecture');
        const layers = ['presentation', 'application', 'domain', 'infrastructure'];
        layers.forEach(layer => {
            const layerDir = path_1.default.join(baseDir, layer);
            fs_1.default.mkdirSync(layerDir, { recursive: true });
            fs_1.default.writeFileSync(path_1.default.join(layerDir, `example${layer}.ts`), `// Ejemplo básico para ${layer}`);
        });
        console.log('Estructura de Capas creada en:', baseDir);
    }
}
exports.CreateLayeredStructure = CreateLayeredStructure;
