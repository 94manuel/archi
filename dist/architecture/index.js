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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateArchitectureStructure = void 0;
const cqrs_1 = require("./cqrs");
const Context_1 = require("./Context");
const hexagonal_1 = require("./hexagonal/hexagonal");
const layered_1 = require("./layered");
const eventDriven_1 = require("./eventDriven");
const cleanArchitecture_1 = require("./cleanArchitecture");
const microservices_1 = require("./microservices");
class CreateArchitectureStructure {
    constructor() {
        this.context = new Context_1.Context();
    }
    init(architecture) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (architecture) {
                case "hexagonal":
                    this.context.setStrategy(new hexagonal_1.CreateHexagonalStructure());
                    break;
                case "cqrs":
                    this.context.setStrategy(new cqrs_1.CreateCQRSstructure());
                    break;
                case "microservices":
                    this.context.setStrategy(new microservices_1.CreateMicroservicesStructure());
                    break;
                case "layered":
                    this.context.setStrategy(new layered_1.CreateLayeredStructure());
                    break;
                case "event-driven":
                    this.context.setStrategy(new eventDriven_1.CreateEventDrivenStructure());
                    break;
                case "clean-architecture":
                    this.context.setStrategy(new cleanArchitecture_1.CreatecleanArchitectureStructure());
                    break;
            }
            this.context.doSomeBusinessLogic();
        });
    }
}
exports.CreateArchitectureStructure = CreateArchitectureStructure;
