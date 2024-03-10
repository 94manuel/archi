"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
class Context {
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    doSomeBusinessLogic() {
        console.log('Context: Sorting data using the strategy (not sure how itll do it)');
        const result = this.strategy.doAlgorithm();
    }
}
exports.Context = Context;
