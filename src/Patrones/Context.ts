export class Context {
        private strategy!: IPatternsStrategy;
    
    
        public setStrategy(strategy: IPatternsStrategy) {
            this.strategy = strategy;
        }
    
        public doSomeBusinessLogic(patterns:string): void {
            console.log('Context: Sorting data using the strategy (not sure how itll do it)');
            const result = this.strategy.doAlgorithm(patterns);
        }
    }