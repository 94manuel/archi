"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const singleton_1 = __importDefault(require("./src/singleton"));
const instance1 = singleton_1.default.getInstance();
const instance2 = singleton_1.default.getInstance();
console.log(instance1 === instance2); // Debería imprimir 'true'
