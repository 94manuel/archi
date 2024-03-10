"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFactoryStructure = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CreateFactoryStructure {
    doAlgorithm(pattern) {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path_1.default.join(process.cwd(), "src", pattern.toLowerCase());
        fs_1.default.mkdirSync(rootDir, { recursive: true });
        const srcDir = path_1.default.join(rootDir, 'src');
        fs_1.default.mkdirSync(srcDir, { recursive: true });
        const factoryDir = path_1.default.join(srcDir, 'factory');
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
        fs_1.default.writeFileSync(path_1.default.join(srcDir, 'Product.ts'), productInterface);
        fs_1.default.writeFileSync(path_1.default.join(srcDir, 'ConcreteProductA.ts'), concreteProductA);
        fs_1.default.writeFileSync(path_1.default.join(srcDir, 'ConcreteProductB.ts'), concreteProductB);
        fs_1.default.writeFileSync(path_1.default.join(srcDir, 'Creator.ts'), creatorInterface);
        fs_1.default.writeFileSync(path_1.default.join(srcDir, 'ConcreteCreatorA.ts'), concreteCreatorA);
        fs_1.default.writeFileSync(path_1.default.join(srcDir, 'ConcreteCreatorB.ts'), concreteCreatorB);
        fs_1.default.writeFileSync(path_1.default.join(rootDir, 'index.ts'), factoryIndexContent);
        console.log(`Factory pattern structure created in ${srcDir}`);
    }
}
exports.CreateFactoryStructure = CreateFactoryStructure;
