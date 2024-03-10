"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAdapterStructure = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CreateAdapterStructure {
    doAlgorithm(pattern) {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path_1.default.join(process.cwd(), "src", pattern.toLowerCase());
        fs_1.default.mkdirSync(rootDir, { recursive: true });
        const srcDir = path_1.default.join(rootDir, 'src');
        fs_1.default.mkdirSync(srcDir, { recursive: true });
        const adapterDir = path_1.default.join(srcDir, 'adapter');
        fs_1.default.mkdirSync(adapterDir, { recursive: true });
        const targetInterface = `export interface Target {
    request(): string;
}`;
        const adapteeClass = `export class Adaptee {
    public specificRequest(): string {
        return '.eetpadA eht fo roivaheb laicepS';
    }
}`;
        const adapterClass = `import { Adaptee } from "./Adaptee";
        import { Target } from "./Target";
export class Adapter implements Target {
    private adaptee: Adaptee;

    constructor(adaptee: Adaptee) {
        this.adaptee = adaptee;
    }

    public request(): string {
        const result = this.adaptee.specificRequest().split('').reverse().join('');
        return \`Adapter: (TRANSLATED) \${result}\`;
    }
}`;
        const adapterIndexContent = `import { Adaptee } from "./src/adapter/Adaptee";
import { Adapter } from "./src/adapter/Adapter";

const adaptee = new Adaptee();
console.log('Adaptee interface is incompatible with the client.');
console.log('Adaptee: ' + adaptee.specificRequest());

const adapter = new Adapter(adaptee);
console.log('Client: But with adapter client can call it is method.');
console.log('Adapter: ' + adapter.request());
`;
        fs_1.default.writeFileSync(path_1.default.join(adapterDir, 'Target.ts'), targetInterface);
        fs_1.default.writeFileSync(path_1.default.join(adapterDir, 'Adaptee.ts'), adapteeClass);
        fs_1.default.writeFileSync(path_1.default.join(adapterDir, 'Adapter.ts'), adapterClass);
        fs_1.default.writeFileSync(path_1.default.join(rootDir, 'index.ts'), adapterIndexContent);
        console.log(`Adapter pattern example created in ${rootDir}/index.ts`);
        console.log(`Adapter pattern structure created in ${adapterDir}`);
    }
}
exports.CreateAdapterStructure = CreateAdapterStructure;
