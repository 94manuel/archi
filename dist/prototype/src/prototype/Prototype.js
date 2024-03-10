"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prototype = void 0;
const ComponentWithBackReference_1 = require("./ComponentWithBackReference");
class Prototype {
    constructor(source) {
        if (source) {
            this.id = source.id;
            this.component = Object.create(source.component);
            this.circularReference = new ComponentWithBackReference_1.ComponentWithBackReference(this, source.circularReference.componentValue);
        }
    }
}
exports.Prototype = Prototype;
