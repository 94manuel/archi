"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStrategyStructure = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CreateStrategyStructure {
    doAlgorithm(pattern) {
        console.log(`Creando estructura para el patrón ${pattern}...`);
        const rootDir = path_1.default.join(process.cwd(), "src", pattern.toLowerCase());
        fs_1.default.mkdirSync(rootDir, { recursive: true });
        const srcDir = path_1.default.join(rootDir, 'src');
        fs_1.default.mkdirSync(srcDir, { recursive: true });
        const strategyDir = path_1.default.join(srcDir, 'strategy');
        fs_1.default.mkdirSync(strategyDir, { recursive: true });
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
        fs_1.default.writeFileSync(path_1.default.join(strategyDir, 'Strategy.ts'), strategyInterface);
        fs_1.default.writeFileSync(path_1.default.join(strategyDir, 'ConcreteStrategyA.ts'), concreteStrategyA);
        fs_1.default.writeFileSync(path_1.default.join(strategyDir, 'ConcreteStrategyB.ts'), concreteStrategyB);
        fs_1.default.writeFileSync(path_1.default.join(strategyDir, 'Context.ts'), context);
        fs_1.default.writeFileSync(path_1.default.join(rootDir, 'index.ts'), strategyIndexContent);
        console.log(`Strategy pattern example created in ${rootDir}/index.ts`);
        console.log(`Strategy pattern structure created in ${strategyDir}`);
    }
}
exports.CreateStrategyStructure = CreateStrategyStructure;
