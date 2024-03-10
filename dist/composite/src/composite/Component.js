"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
class Component {
    constructor() {
        this.parent = null;
    }
    setParent(parent) {
        this.parent = parent;
    }
    getParent() {
        return this.parent;
    }
    add(component) { }
    remove(component) { }
    isComposite() {
        return false;
    }
}
exports.Component = Component;
