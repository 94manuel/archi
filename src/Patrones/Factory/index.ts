import path from 'path';
import fs from 'fs';

export class CreateFactoryStructure implements IPatternsStrategy {
  doAlgorithm(pattern: string): void {
    console.log(`Creando estructura para el patrón ${pattern}...`);
    const rootDir = path.join(process.cwd(), "src", pattern.toLowerCase());
    fs.mkdirSync(rootDir, { recursive: true });
    const srcDir = path.join(rootDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });

    const factoryDir = path.join(srcDir, 'factory');
    const productInterface = `export interface Product {
      operation(): string;
}`;

    const concreteProductA = `import { Product } from "./Product";
export class ConcreteProductA implements Product {
    public operation(): string {
        return 'Result of ConcreteProductA';
    }
}`;

    const concreteProductB = `import { Product } from "./Product";
export class ConcreteProductB implements Product {
    public operation(): string {
        return 'Result of ConcreteProductB';
    }
}`;

    const creatorInterface = `import { Product } from "./Product";

export abstract class Creator {
    public abstract factoryMethod(): Product;

    public someOperation(): string {
        const product = this.factoryMethod();
        return \`Creator: The same creator's code has just worked with \${product.operation()}\`;
    }
}`;

    const concreteCreatorA = `import { ConcreteProductA } from "./ConcreteProductA";
import { Product } from "./Product";
import { Creator } from "./Creator";

export class ConcreteCreatorA extends Creator {
    public factoryMethod(): Product {
        return new ConcreteProductA();
    }
}`;

    const concreteCreatorB = `import { ConcreteProductB } from "./ConcreteProductB";
import { Product } from "./Product";
import { Creator } from "./Creator";

export class ConcreteCreatorB extends Creator {
    public factoryMethod(): Product {
        return new ConcreteProductB();
    }
}`;
    const factoryIndexContent = `import { ConcreteCreatorA } from "./src/ConcreteCreatorA";
import { ConcreteCreatorB } from "./src/ConcreteCreatorB";

    const creatorA = new ConcreteCreatorA();
    console.log('Client: Testing client code with the first creator type...');
    console.log(creatorA.someOperation());
       
    const creatorB = new ConcreteCreatorB();
    console.log('Client: Testing the same client code with the second creator type...');
    console.log(creatorB.someOperation());
`;

    fs.writeFileSync(path.join(srcDir, 'Product.ts'), productInterface);
    fs.writeFileSync(path.join(srcDir, 'ConcreteProductA.ts'), concreteProductA);
    fs.writeFileSync(path.join(srcDir, 'ConcreteProductB.ts'), concreteProductB);
    fs.writeFileSync(path.join(srcDir, 'Creator.ts'), creatorInterface);
    fs.writeFileSync(path.join(srcDir, 'ConcreteCreatorA.ts'), concreteCreatorA);
    fs.writeFileSync(path.join(srcDir, 'ConcreteCreatorB.ts'), concreteCreatorB);
    fs.writeFileSync(path.join(rootDir, 'index.ts'), factoryIndexContent);
    console.log(`Factory pattern structure created in ${srcDir}`);
  }

}