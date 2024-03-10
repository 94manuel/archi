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
const commander_1 = require("commander");
const enquirer_1 = __importDefault(require("enquirer"));
const architecture_1 = require("./architecture");
const Patrones_1 = require("./Patrones");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CLIApplication {
    constructor() {
        this.config = {};
        this.program = new commander_1.Command();
        this.enquirer = new enquirer_1.default();
        this.configPath = path_1.default.join(process.cwd(), 'sculptor.config.json');
        this.loadConfig();
        this.setupCommands();
        this.UsingArchitecture = false;
    }
    static getInstance() {
        if (!CLIApplication.instance) {
            CLIApplication.instance = new CLIApplication();
        }
        return CLIApplication.instance;
    }
    loadConfig() {
        if (fs_1.default.existsSync(this.configPath)) {
            this.config = JSON.parse(fs_1.default.readFileSync(this.configPath, 'utf-8'));
        }
    }
    saveConfig() {
        fs_1.default.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    }
    setupCommands() {
        this.program
            .name("design-pattern-cli")
            .description("CLI para inicializar proyectos con patrones de diseño y arquitecturas")
            .version("1.0.0");
        this.program.command("patterns")
            .description("Inicializa un nuevo proyecto de patrón de diseño")
            .action(() => this.handlePatternCommand());
        this.program.command("architecture")
            .description("Crea la estructura de carpetas para una Arquitectura")
            .action(() => this.handleArchitectureCommand());
    }
    handlePatternCommand() {
        return __awaiter(this, void 0, void 0, function* () {
            this.enquirer.prompt([
                {
                    type: "select",
                    name: "pattern",
                    message: "¿Qué patrón de diseño te gustaría utilizar?",
                    choices: [
                        "Singleton",
                        "Factory",
                        "Observer",
                        "Strategy",
                        "Decorator",
                        "Adapter",
                        "Composite",
                        "Prototype",
                        "Builder"
                    ],
                }
            ])
                .then((answers) => {
                console.log(`Inicializando proyecto con el patrón ${answers.pattern}...`);
                const createPatternsStructure = new Patrones_1.CreatePatternsStructure();
                createPatternsStructure.init(answers.pattern);
            });
        });
    }
    handleArchitectureCommand() {
        return __awaiter(this, void 0, void 0, function* () {
            const architecture = this.config.defaultArchitecture;
            console.log(architecture);
            if (architecture) {
                yield this.enquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'useExisting',
                        message: `Ya tienes configurada la arquitectura '${architecture}'. ¿Quieres usar esta configuración?`,
                    }
                ]).then((answers) => {
                    if (answers.useExisting) {
                        console.log(`Usando la arquitectura configurada: ${architecture}...`);
                        const createArchitectureStructure = new architecture_1.CreateArchitectureStructure();
                        createArchitectureStructure.init(architecture);
                        this.UsingArchitecture = true;
                    }
                    else {
                        this.UsingArchitecture = false;
                    }
                });
            }
            console.log(this.UsingArchitecture);
            if (!this.UsingArchitecture) {
                yield this.enquirer.prompt([
                    {
                        type: "select",
                        name: "architecture",
                        message: "¿Qué Arquitectura te gustaría utilizar?",
                        choices: [
                            "hexagonal",
                            "cqrs",
                            "microservices",
                            "layered",
                            "event-driven",
                            "clean-architecture"
                        ],
                    }
                ])
                    .then((answers) => {
                    console.log(`Inicializando proyecto con la arquitectura ${answers.architecture}...`);
                    const createArchitectureStructure = new architecture_1.CreateArchitectureStructure();
                    createArchitectureStructure.init(answers.architecture);
                    this.config.defaultArchitecture = answers.architecture;
                });
                this.saveConfig();
            }
        });
    }
    run() {
        this.program.parse(process.argv);
    }
}
const cliApp = CLIApplication.getInstance();
cliApp.run();
