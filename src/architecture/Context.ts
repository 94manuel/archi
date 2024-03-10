export class Context {
        private strategy!: Strategy;
    
    
        public setStrategy(strategy: Strategy) {
            this.strategy = strategy;
        }
    
        public doSomeBusinessLogic(): void {
            console.log('Context: Sorting data using the strategy (not sure how itll do it)');
            const result = this.strategy.doAlgorithm();
        }
    }