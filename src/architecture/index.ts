import { CreateCQRSstructure } from './cqrs';
import { Context } from "./Context";
import { CreateHexagonalStructure } from './hexagonal/hexagonal';
import { CreateLayeredStructure } from './layered';
import { CreateEventDrivenStructure } from './eventDriven';
import { CreatecleanArchitectureStructure } from './cleanArchitecture';
import { CreateMicroservicesStructure } from './microservices';


export class CreateArchitectureStructure {
    private context: Context;

    constructor() {
        this.context = new Context()
    }

    async init(architecture: string) {
        switch (architecture) {
            case "hexagonal":
                this.context.setStrategy(new CreateHexagonalStructure())
                break;
            case "cqrs":
                this.context.setStrategy(new CreateCQRSstructure())
                break;
            case "microservices":
                this.context.setStrategy(new CreateMicroservicesStructure())
                break;
            case "layered":
                this.context.setStrategy(new CreateLayeredStructure())
                break;
            case "event-driven":
                this.context.setStrategy(new CreateEventDrivenStructure())
                break;
            case "clean-architecture":
                this.context.setStrategy(new CreatecleanArchitectureStructure())
                break;
        }
        this.context.doSomeBusinessLogic()
    }
}