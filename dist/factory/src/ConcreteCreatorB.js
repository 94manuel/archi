"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteCreatorB = void 0;
const ConcreteProductB_1 = require("./ConcreteProductB");
const Creator_1 = require("./Creator");
class ConcreteCreatorB extends Creator_1.Creator {
    factoryMethod() {
        return new ConcreteProductB_1.ConcreteProductB();
    }
}
exports.ConcreteCreatorB = ConcreteCreatorB;
