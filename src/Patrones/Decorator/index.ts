import path from 'path';
import fs from 'fs';

export class CreateDecoratorStructure implements IPatternsStrategy {
    doAlgorithm(pattern:string): void {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path.join(process.cwd(), "src", pattern.toLowerCase());
        fs.mkdirSync(rootDir, { recursive: true });
        const srcDir = path.join(rootDir, 'src');
        fs.mkdirSync(srcDir, { recursive: true });
        
        const decoratorDir = path.join(srcDir, 'decorator');
        fs.mkdirSync(decoratorDir, { recursive: true });

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

        fs.writeFileSync(path.join(decoratorDir, 'Component.ts'), componentInterface);
        fs.writeFileSync(path.join(decoratorDir, 'ConcreteComponent.ts'), concreteComponent);
        fs.writeFileSync(path.join(decoratorDir, 'Decorator.ts'), decoratorClass);
        fs.writeFileSync(path.join(decoratorDir, 'ConcreteDecoratorA.ts'), concreteDecoratorA);
        fs.writeFileSync(path.join(decoratorDir, 'ConcreteDecoratorB.ts'), concreteDecoratorB);
        fs.writeFileSync(path.join(rootDir, 'index.ts'), decoratorIndexContent);
        console.log(`Decorator pattern example created in ${rootDir}/index.ts`);
        console.log(`Decorator pattern structure created in ${decoratorDir}`);
    }
    
}