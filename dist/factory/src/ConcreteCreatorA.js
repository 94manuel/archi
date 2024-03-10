"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteCreatorA = void 0;
const ConcreteProductA_1 = require("./ConcreteProductA");
const Creator_1 = require("./Creator");
class ConcreteCreatorA extends Creator_1.Creator {
    factoryMethod() {
        return new ConcreteProductA_1.ConcreteProductA();
    }
}
exports.ConcreteCreatorA = ConcreteCreatorA;
