import path from 'path';
import fs from 'fs';

export class CreatePrototypeStructure implements IPatternsStrategy {
    doAlgorithm(pattern:string): void {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path.join(process.cwd(), "src", pattern.toLowerCase());
        fs.mkdirSync(rootDir, { recursive: true });
        const srcDir = path.join(rootDir, 'src');
        fs.mkdirSync(srcDir, { recursive: true });
        
        const prototypeDir = path.join(srcDir, 'prototype');
        fs.mkdirSync(prototypeDir, { recursive: true });

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

        fs.writeFileSync(path.join(prototypeDir, 'Prototype.ts'), prototypeContent);
        fs.writeFileSync(path.join(prototypeDir, 'ConcretePrototype.ts'), concretePrototypeContent);
        fs.writeFileSync(path.join(prototypeDir, 'ComponentWithBackReference.ts'), componentWithBackReferenceContent);
        fs.writeFileSync(path.join(rootDir, 'index.ts'), prototypeIndexContent);
        console.log(`Prototype pattern structure created in ${prototypeDir}`);
    }
    
}