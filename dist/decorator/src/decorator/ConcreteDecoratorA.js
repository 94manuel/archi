"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteDecoratorA = void 0;
const Decorator_1 = require("./Decorator");
class ConcreteDecoratorA extends Decorator_1.Decorator {
    operation() {
        return `ConcreteDecoratorA(${super.operation()})`;
    }
}
exports.ConcreteDecoratorA = ConcreteDecoratorA;
