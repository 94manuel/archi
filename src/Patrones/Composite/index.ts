import path from 'path';
import fs from 'fs';

export class CreateCompositeStructure implements IPatternsStrategy {
    doAlgorithm(pattern:string): void {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path.join(process.cwd(), "src", pattern.toLowerCase());
        fs.mkdirSync(rootDir, { recursive: true });
        const srcDir = path.join(rootDir, 'src');
        fs.mkdirSync(srcDir, { recursive: true });
        
        const compositeDir = path.join(srcDir, 'composite');
        fs.mkdirSync(compositeDir, { recursive: true });

        const component = `export abstract class Component {
            protected parent: Component | null = null;

            public setParent(parent: Component | null) {
                this.parent = parent;
            }

            public getParent(): Component | null {
                return this.parent;
            }

            public add(component: Component): void {}

            public remove(component: Component): void {}

            public isComposite(): boolean {
                return false;
            }

            public abstract operation(): string;
}`;

        const leaf = `import { Component } from "./Component";

export class Leaf extends Component {
    public operation(): string {
        return 'Leaf';
    }
}`;

        const composite = `import { Component } from "./Component";

export class Composite extends Component {
    protected children: Component[] = [];

    public add(component: Component): void {
        this.children.push(component);
        component.setParent(this);
    }

    public remove(component: Component): void {
        const componentIndex = this.children.indexOf(component);
        this.children.splice(componentIndex, 1);
        component.setParent(null);
    }

    public isComposite(): boolean {
        return true;
    }

    public operation(): string {
        const results = [];
        for (const child of this.children) {
            results.push(child.operation());
        }
        return \`Branch(\${results.join('+')})\`;
    }
}`;
        const compositeIndexContent = `import { Composite } from "./src/composite/Composite";
import { Leaf } from "./src/composite/Leaf";

            const tree = new Composite();
            const branch1 = new Composite();
            branch1.add(new Leaf());
            branch1.add(new Leaf());

            const branch2 = new Composite();
            branch2.add(new Leaf());

            tree.add(branch1);
            tree.add(branch2);

            console.log('Client: Now I love got a composite tree:');
            console.log(tree.operation());
            `;

        fs.writeFileSync(path.join(compositeDir, 'Component.ts'), component);
        fs.writeFileSync(path.join(compositeDir, 'Leaf.ts'), leaf);
        fs.writeFileSync(path.join(compositeDir, 'Composite.ts'), composite);
        fs.writeFileSync(path.join(rootDir, 'index.ts'), compositeIndexContent);
        console.log(`Composite pattern example created in ${rootDir}/index.ts`);
        console.log(`Composite pattern structure created in ${compositeDir}`);
    }
    
}