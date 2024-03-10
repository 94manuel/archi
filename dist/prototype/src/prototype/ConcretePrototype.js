"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcretePrototype = void 0;
const Prototype_1 = require("./Prototype");
class ConcretePrototype extends Prototype_1.Prototype {
    clone() {
        return new ConcretePrototype(this);
    }
}
exports.ConcretePrototype = ConcretePrototype;
