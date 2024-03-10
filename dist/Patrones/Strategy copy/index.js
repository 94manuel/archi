"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBuilderStructure = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CreateBuilderStructure {
    doAlgorithm(pattern) {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path_1.default.join(process.cwd(), "src", pattern.toLowerCase());
        fs_1.default.mkdirSync(rootDir, { recursive: true });
        const srcDir = path_1.default.join(rootDir, 'src');
        fs_1.default.mkdirSync(srcDir, { recursive: true });
        const builderDir = path_1.default.join(srcDir, 'builder');
        fs_1.default.mkdirSync(builderDir, { recursive: true });
        const productContent = `class Product {
            parts: string[] = [];
        
            public listParts(): void {
                console.log(\`Product parts: \${this.parts.join(', ')}\\n\`);
            }
        }`;
        const builderContent = `export interface Builder {
            reset(): void;
            buildPartA(): void;
            buildPartB(): void;
            buildPartC(): void;
        }`;
        const concreteBuilderContent = `import { Builder } from "./Builder";

export class ConcreteBuilder implements Builder {
            private product!: Product;
        
            constructor() {
                this.reset();
            }
        
            public reset(): void {
                this.product = new Product();
            }
        
            public buildPartA(): void {
                this.product.parts.push('PartA');
            }
        
            public buildPartB(): void {
                this.product.parts.push('PartB');
            }
        
            public buildPartC(): void {
                this.product.parts.push('PartC');
            }
        
            public getProduct(): Product {
                const result = this.product;
                this.reset();
                return result;
            }
}`;
        const directorContent = `import { ConcreteBuilder } from "./ConcreteBuilder";
import { Director } from "./Director";

export class Director {
            private builder!: Builder;
        
            public setBuilder(builder: Builder): void {
                this.builder = builder;
            }
        
            public buildMinimalViableProduct(): void {
                this.builder.buildPartA();
            }
        
            public buildFullFeaturedProduct(): void {
                this.builder.buildPartA();
                this.builder.buildPartB();
                this.builder.buildPartC();
            }
        }`;
        const builderIndexContent = `const director = new Director();
        const builder = new ConcreteBuilder();
        director.setBuilder(builder);
        
        console.log('Standard basic product:');
        director.buildMinimalViableProduct();
        builder.getProduct().listParts();
        
        console.log('Standard full featured product:');
        director.buildFullFeaturedProduct();
        builder.getProduct().listParts();
        `;
        fs_1.default.writeFileSync(path_1.default.join(builderDir, 'Product.ts'), productContent);
        fs_1.default.writeFileSync(path_1.default.join(builderDir, 'Builder.ts'), builderContent);
        fs_1.default.writeFileSync(path_1.default.join(builderDir, 'ConcreteBuilder.ts'), concreteBuilderContent);
        fs_1.default.writeFileSync(path_1.default.join(builderDir, 'Director.ts'), directorContent);
        fs_1.default.writeFileSync(path_1.default.join(builderDir, 'index.ts'), builderIndexContent);
        console.log(`Builder pattern structure created in ${builderDir}`);
    }
}
exports.CreateBuilderStructure = CreateBuilderStructure;
