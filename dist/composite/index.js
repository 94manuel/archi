"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Composite_1 = require("./src/composite/Composite");
const Leaf_1 = require("./src/composite/Leaf");
const tree = new Composite_1.Composite();
const branch1 = new Composite_1.Composite();
branch1.add(new Leaf_1.Leaf());
branch1.add(new Leaf_1.Leaf());
const branch2 = new Composite_1.Composite();
branch2.add(new Leaf_1.Leaf());
tree.add(branch1);
tree.add(branch2);
console.log('Client: Now I love got a composite tree:');
console.log(tree.operation());
