"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentWithBackReference = void 0;
class ComponentWithBackReference {
    constructor(prototype, value) {
        this.prototype = prototype;
        this.componentValue = value;
    }
}
exports.ComponentWithBackReference = ComponentWithBackReference;
