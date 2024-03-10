"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConcreteBuilder_1 = require("./ConcreteBuilder");
const Director_1 = require("./Director");
const director = new Director_1.Director();
const builder = new ConcreteBuilder_1.ConcreteBuilder();
director.setBuilder(builder);
console.log('Standard basic product:');
director.buildMinimalViableProduct();
builder.getProduct().listParts();
console.log('Standard full featured product:');
director.buildFullFeaturedProduct();
builder.getProduct().listParts();
