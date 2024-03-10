"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConcreteBuilder = void 0;
const Product_1 = require("./Product");
class ConcreteBuilder {
    constructor() {
        this.reset();
    }
    reset() {
        this.product = new Product_1.Product();
    }
    buildPartA() {
        this.product.parts.push('PartA');
    }
    buildPartB() {
        this.product.parts.push('PartB');
    }
    buildPartC() {
        this.product.parts.push('PartC');
    }
    getProduct() {
        const result = this.product;
        this.reset();
        return result;
    }
}
exports.ConcreteBuilder = ConcreteBuilder;
