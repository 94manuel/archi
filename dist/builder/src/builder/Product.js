"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor() {
        this.parts = [];
    }
    listParts() {
        console.log(`Product parts: ${this.parts.join(', ')}\n`);
    }
}
exports.Product = Product;
