import path from 'path';
import fs from 'fs';

export class CreateAdapterStructure implements IPatternsStrategy {
    doAlgorithm(pattern:string): void {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path.join(process.cwd(), "src", pattern.toLowerCase());
        fs.mkdirSync(rootDir, { recursive: true });
        const srcDir = path.join(rootDir, 'src');
        fs.mkdirSync(srcDir, { recursive: true });

        const adapterDir = path.join(srcDir, 'adapter');
        fs.mkdirSync(adapterDir, { recursive: true });

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

        fs.writeFileSync(path.join(adapterDir, 'Target.ts'), targetInterface);
        fs.writeFileSync(path.join(adapterDir, 'Adaptee.ts'), adapteeClass);
        fs.writeFileSync(path.join(adapterDir, 'Adapter.ts'), adapterClass);
        fs.writeFileSync(path.join(rootDir, 'index.ts'), adapterIndexContent);
        console.log(`Adapter pattern example created in ${rootDir}/index.ts`);
        console.log(`Adapter pattern structure created in ${adapterDir}`);
    }
    
}