"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Composite = void 0;
const Component_1 = require("./Component");
class Composite extends Component_1.Component {
    constructor() {
        super(...arguments);
        this.children = [];
    }
    add(component) {
        this.children.push(component);
        component.setParent(this);
    }
    remove(component) {
        const componentIndex = this.children.indexOf(component);
        this.children.splice(componentIndex, 1);
        component.setParent(null);
    }
    isComposite() {
        return true;
    }
    operation() {
        const results = [];
        for (const child of this.children) {
            results.push(child.operation());
        }
        return `Branch(${results.join('+')})`;
    }
}
exports.Composite = Composite;
