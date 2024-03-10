"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteDecoratorB = void 0;
const Decorator_1 = require("./Decorator");
class ConcreteDecoratorB extends Decorator_1.Decorator {
    operation() {
        return `ConcreteDecoratorB(${super.operation()})`;
    }
}
exports.ConcreteDecoratorB = ConcreteDecoratorB;
