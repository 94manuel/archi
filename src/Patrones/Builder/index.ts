import path from 'path';
import fs from 'fs';

export class CreateBuilderStructure implements IPatternsStrategy {
    doAlgorithm(pattern:string): void {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path.join(process.cwd(), "src", pattern.toLowerCase());
        fs.mkdirSync(rootDir, { recursive: true });
        const srcDir = path.join(rootDir, 'src');
        fs.mkdirSync(srcDir, { recursive: true });
        
        const builderDir = path.join(srcDir, 'builder');
        fs.mkdirSync(builderDir, { recursive: true });

        const productContent = `export class Product {
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
import { Product } from "./Product";

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

        const directorContent = `import { Builder } from "./Builder";

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

        const builderIndexContent = `import { ConcreteBuilder } from "./ConcreteBuilder";
import { Director } from "./Director";
        
        const director = new Director();
        const builder = new ConcreteBuilder();
        director.setBuilder(builder);
        
        console.log('Standard basic product:');
        director.buildMinimalViableProduct();
        builder.getProduct().listParts();
        
        console.log('Standard full featured product:');
        director.buildFullFeaturedProduct();
        builder.getProduct().listParts();
        `;

        fs.writeFileSync(path.join(builderDir, 'Product.ts'), productContent);
        fs.writeFileSync(path.join(builderDir, 'Builder.ts'), builderContent);
        fs.writeFileSync(path.join(builderDir, 'ConcreteBuilder.ts'), concreteBuilderContent);
        fs.writeFileSync(path.join(builderDir, 'Director.ts'), directorContent);
        fs.writeFileSync(path.join(builderDir, 'index.ts'), builderIndexContent);
        console.log(`Builder pattern structure created in ${builderDir}`);
    }
    
}