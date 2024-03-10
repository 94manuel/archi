import path from 'path';
import fs from 'fs';

export class CreateStrategyStructure implements IPatternsStrategy {
    doAlgorithm(pattern:string): void {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path.join(process.cwd(), "src", pattern.toLowerCase());
        fs.mkdirSync(rootDir, { recursive: true });
        const srcDir = path.join(rootDir, 'src');
        fs.mkdirSync(srcDir, { recursive: true });
        
        const strategyDir = path.join(srcDir, 'strategy');
        fs.mkdirSync(strategyDir, { recursive: true });

        const strategyInterface = `export interface Strategy {
    doAlgorithm(data: string[]): string[];
}`;

        const concreteStrategyA = `import { Strategy } from "./Strategy";

export class ConcreteStrategyA implements Strategy {
    public doAlgorithm(data: string[]): string[] {
        return data.sort();
    }
}`;

        const concreteStrategyB = `import { Strategy } from "./Strategy";

export class ConcreteStrategyB implements Strategy {
    public doAlgorithm(data: string[]): string[] {
        return data.reverse();
    }
}`;

                const context = `import { Strategy } from "./Strategy";
                
export class Context {
        private strategy: Strategy;

        constructor(strategy: Strategy) {
            this.strategy = strategy;
        }

        public setStrategy(strategy: Strategy) {
            this.strategy = strategy;
        }

        public doSomeBusinessLogic(): void {
            console.log('Context: Sorting data using the strategy (not sure how it all do it)');
            const result = this.strategy.doAlgorithm(['a', 'b', 'c', 'd', 'e']);
            console.log(result.join(','));
        }
}`;
        const strategyIndexContent = `import { ConcreteStrategyA } from "./src/strategy/ConcreteStrategyA";
import { ConcreteStrategyB } from "./src/strategy/ConcreteStrategyB";
import { Context } from "./src/strategy/Context";

        const context = new Context(new ConcreteStrategyA());
        console.log('Client: Strategy is set to normal sorting.');
        context.doSomeBusinessLogic();

        console.log('');

        context.setStrategy(new ConcreteStrategyB());
        console.log('Client: Strategy is set to reverse sorting.');
        context.doSomeBusinessLogic();
        `;

        fs.writeFileSync(path.join(strategyDir, 'Strategy.ts'), strategyInterface);
        fs.writeFileSync(path.join(strategyDir, 'ConcreteStrategyA.ts'), concreteStrategyA);
        fs.writeFileSync(path.join(strategyDir, 'ConcreteStrategyB.ts'), concreteStrategyB);
        fs.writeFileSync(path.join(strategyDir, 'Context.ts'), context);
        fs.writeFileSync(path.join(rootDir, 'index.ts'), strategyIndexContent);
        console.log(`Strategy pattern example created in ${rootDir}/index.ts`);
        console.log(`Strategy pattern structure created in ${strategyDir}`);
    }
    
}