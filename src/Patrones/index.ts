import { Context } from "./Context";
import { CreateFactoryStructure } from "./Factory";
import { CreateSingletonStructure } from "./singleton";
import path from 'path';
import fs from 'fs';
import { CreateObserverStructure } from "./Observer"
import { CreateStrategyStructure } from "./Strategy/index";
import { CreateDecoratorStructure } from "./Decorator";
import { CreateAdapterStructure } from "./Adapter";
import { CreateCompositeStructure } from "./Composite";
import { CreatePrototypeStructure } from "./Prototype";
import { CreateBuilderStructure } from "./Builder/index";

export class CreatePatternsStructure {
    private context: Context;

    constructor() {
        this.context = new Context()
    }

    async init(patterns: string) {
        console.log(`Creando estructura para el patrón ${patterns}...`);
        const rootDir = path.join(process.cwd(), "src", patterns.toLowerCase());
        fs.mkdirSync(rootDir, { recursive: true });
        const srcDir = path.join(rootDir, 'src');
        fs.mkdirSync(srcDir, { recursive: true });

        switch (patterns) {
            case "Singleton":
                this.context.setStrategy(new CreateSingletonStructure())
                break;
            case "Factory":
                this.context.setStrategy(new CreateFactoryStructure())
                break;
            case "Observer":
                this.context.setStrategy(new CreateObserverStructure())
                break;
            case "Strategy":
                this.context.setStrategy(new CreateStrategyStructure())
                break;
            case "Decorator":
                this.context.setStrategy(new CreateDecoratorStructure())
                break;
            case "Adapter":
                this.context.setStrategy(new CreateAdapterStructure())
                break;
            case "Composite":
                this.context.setStrategy(new CreateCompositeStructure())
                break;
            case "Prototype":
                this.context.setStrategy(new CreatePrototypeStructure())
                break;
            case "Builder":
                this.context.setStrategy(new CreateBuilderStructure())
                break;
        }
        this.context.doSomeBusinessLogic(patterns)
    }
}