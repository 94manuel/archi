"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePatternsStructure = void 0;
const Context_1 = require("./Context");
const Factory_1 = require("./Factory");
const singleton_1 = require("./singleton");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Observer_1 = require("./Observer");
const index_1 = require("./Strategy/index");
const Decorator_1 = require("./Decorator");
const Adapter_1 = require("./Adapter");
const Composite_1 = require("./Composite");
const Prototype_1 = require("./Prototype");
const index_2 = require("./Builder/index");
class CreatePatternsStructure {
    constructor() {
        this.context = new Context_1.Context();
    }
    init(patterns) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Creando estructura para el patrón ${patterns}...`);
            const rootDir = path_1.default.join(process.cwd(), "src", patterns.toLowerCase());
            fs_1.default.mkdirSync(rootDir, { recursive: true });
            const srcDir = path_1.default.join(rootDir, 'src');
            fs_1.default.mkdirSync(srcDir, { recursive: true });
            switch (patterns) {
                case "Singleton":
                    this.context.setStrategy(new singleton_1.CreateSingletonStructure());
                    break;
                case "Factory":
                    this.context.setStrategy(new Factory_1.CreateFactoryStructure());
                    break;
                case "Observer":
                    this.context.setStrategy(new Observer_1.CreateObserverStructure());
                    break;
                case "Strategy":
                    this.context.setStrategy(new index_1.CreateStrategyStructure());
                    break;
                case "Decorator":
                    this.context.setStrategy(new Decorator_1.CreateDecoratorStructure());
                    break;
                case "Adapter":
                    this.context.setStrategy(new Adapter_1.CreateAdapterStructure());
                    break;
                case "Composite":
                    this.context.setStrategy(new Composite_1.CreateCompositeStructure());
                    break;
                case "Prototype":
                    this.context.setStrategy(new Prototype_1.CreatePrototypeStructure());
                    break;
                case "Builder":
                    this.context.setStrategy(new index_2.CreateBuilderStructure());
                    break;
            }
            this.context.doSomeBusinessLogic(patterns);
        });
    }
}
exports.CreatePatternsStructure = CreatePatternsStructure;
