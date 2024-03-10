"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDecoratorStructure = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CreateDecoratorStructure {
    doAlgorithm(pattern) {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path_1.default.join(process.cwd(), "src", pattern.toLowerCase());
        fs_1.default.mkdirSync(rootDir, { recursive: true });
        const srcDir = path_1.default.join(rootDir, 'src');
        fs_1.default.mkdirSync(srcDir, { recursive: true });
        const decoratorDir = path_1.default.join(srcDir, 'decorator');
        fs_1.default.mkdirSync(decoratorDir, { recursive: true });
        const componentInterface = `export interface Component {
    operation(): string;
}`;
        const concreteComponent = `import { Component } from "./Component";

export class ConcreteComponent implements Component {
    public operation(): string {
        return 'ConcreteComponent';
    }
}`;
        const decoratorClass = `import { Component } from "./Component";

export class Decorator implements Component {
    protected component: Component;

    constructor(component: Component) {
        this.component = component;
    }

    public operation(): string {
        return this.component.operation();
    }
}`;
        const concreteDecoratorA = `import { Decorator } from "./Decorator";

export class ConcreteDecoratorA extends Decorator {
    public operation(): string {
        return \`ConcreteDecoratorA(\${super.operation()})\`;
    }
}`;
        const concreteDecoratorB = `import { Decorator } from "./Decorator";

export class ConcreteDecoratorB extends Decorator {
    public operation(): string {
        return \`ConcreteDecoratorB(\${super.operation()})\`;
    }
}`;
        const decoratorIndexContent = `import { ConcreteComponent } from "./src/decorator/ConcreteComponent";
import { ConcreteDecoratorA } from "./src/decorator/ConcreteDecoratorA";
import { ConcreteDecoratorB } from "./src/decorator/ConcreteDecoratorB";

const simple = new ConcreteComponent();
console.log('Client: I love got a simple component:');
console.log(simple.operation());

console.log('\\n');

const decorator1 = new ConcreteDecoratorA(simple);
const decorator2 = new ConcreteDecoratorB(decorator1);
console.log('Client: Now I love got a decorated component:');
console.log(decorator2.operation());
`;
        fs_1.default.writeFileSync(path_1.default.join(decoratorDir, 'Component.ts'), componentInterface);
        fs_1.default.writeFileSync(path_1.default.join(decoratorDir, 'ConcreteComponent.ts'), concreteComponent);
        fs_1.default.writeFileSync(path_1.default.join(decoratorDir, 'Decorator.ts'), decoratorClass);
        fs_1.default.writeFileSync(path_1.default.join(decoratorDir, 'ConcreteDecoratorA.ts'), concreteDecoratorA);
        fs_1.default.writeFileSync(path_1.default.join(decoratorDir, 'ConcreteDecoratorB.ts'), concreteDecoratorB);
        fs_1.default.writeFileSync(path_1.default.join(rootDir, 'index.ts'), decoratorIndexContent);
        console.log(`Decorator pattern example created in ${rootDir}/index.ts`);
        console.log(`Decorator pattern structure created in ${decoratorDir}`);
    }
}
exports.CreateDecoratorStructure = CreateDecoratorStructure;
