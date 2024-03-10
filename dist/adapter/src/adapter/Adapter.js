"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adapter = void 0;
class Adapter {
    constructor(adaptee) {
        this.adaptee = adaptee;
    }
    request() {
        const result = this.adaptee.specificRequest().split('').reverse().join('');
        return `Adapter: (TRANSLATED) ${result}`;
    }
}
exports.Adapter = Adapter;
