"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePrototypeStructure = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CreatePrototypeStructure {
    doAlgorithm(pattern) {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path_1.default.join(process.cwd(), "src", pattern.toLowerCase());
        fs_1.default.mkdirSync(rootDir, { recursive: true });
        const srcDir = path_1.default.join(rootDir, 'src');
        fs_1.default.mkdirSync(srcDir, { recursive: true });
        const prototypeDir = path_1.default.join(srcDir, 'prototype');
        fs_1.default.mkdirSync(prototypeDir, { recursive: true });
        const prototypeContent = `import { ComponentWithBackReference } from "./ComponentWithBackReference";

export abstract class Prototype {
    public id!: string;
    public component!: object;
    public circularReference!: ComponentWithBackReference;

    constructor(source?: Prototype) {
        if (source) {
            this.id = source.id;
            this.component = Object.create(source.component);
            this.circularReference = new ComponentWithBackReference(this, source.circularReference.componentValue);
        }
    }

    public abstract clone(): this;
}`;
        const concretePrototypeContent = `import { Prototype } from "./Prototype";

export class ConcretePrototype extends Prototype {
    public clone(): this {
        return new ConcretePrototype(this);
    }
}`;
        const componentWithBackReferenceContent = `import { Prototype } from "./Prototype";

export class ComponentWithBackReference {
    public prototype;
    public componentValue: string;

    constructor(prototype: Prototype, value: string) {
        this.prototype = prototype;
        this.componentValue = value;
    }
}`;
        const prototypeIndexContent = `import { ComponentWithBackReference } from "./src/prototype/ComponentWithBackReference";
import { ConcretePrototype } from "./src/prototype/ConcretePrototype";        

const originalPrototype = new ConcretePrototype();
            originalPrototype.id = '1';
            originalPrototype.component = new Date();
            originalPrototype.circularReference = new ComponentWithBackReference(originalPrototype, 'Initial value');

            const clonedPrototype = originalPrototype.clone();
            console.log('Cloned Prototype ID:', clonedPrototype.id);
            `;
        fs_1.default.writeFileSync(path_1.default.join(prototypeDir, 'Prototype.ts'), prototypeContent);
        fs_1.default.writeFileSync(path_1.default.join(prototypeDir, 'ConcretePrototype.ts'), concretePrototypeContent);
        fs_1.default.writeFileSync(path_1.default.join(prototypeDir, 'ComponentWithBackReference.ts'), componentWithBackReferenceContent);
        fs_1.default.writeFileSync(path_1.default.join(rootDir, 'index.ts'), prototypeIndexContent);
        console.log(`Prototype pattern structure created in ${prototypeDir}`);
    }
}
exports.CreatePrototypeStructure = CreatePrototypeStructure;
