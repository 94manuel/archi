import { Command } from 'commander';
import Enquirer from 'enquirer';
import { CreateArchitectureStructure } from './architecture';
import { CreatePatternsStructure } from './Patrones';
import path from 'path';
import fs from 'fs';

class CLIApplication {
  private program: Command;
  private enquirer: Enquirer;
  private configPath: string;
  private config: { defaultPattern?: string; defaultArchitecture?: string } = {};
  private UsingArchitecture?: boolean
  private static instance: CLIApplication;

  constructor() {
    this.program = new Command();
    this.enquirer = new Enquirer();
    this.configPath = path.join(process.cwd(), 'sculptor.config.json');
    this.loadConfig();
    this.setupCommands();
    this.UsingArchitecture = false;
  }

  public static getInstance(): CLIApplication {
    if (!CLIApplication.instance) {
      CLIApplication.instance = new CLIApplication();
    }

    return CLIApplication.instance;
  }

  private loadConfig() {
    if (fs.existsSync(this.configPath)) {
      this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
    }
  }

  private saveConfig() {
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
  }

  private setupCommands(): void {
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

  private async handlePatternCommand() {
    this.enquirer.prompt([
      {
        type: "select", // 'select' es equivalente a 'list' en inquirer
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
      .then((answers: any) => {
        console.log(`Inicializando proyecto con el patrón ${answers.pattern}...`);
        const createPatternsStructure = new CreatePatternsStructure();
        createPatternsStructure.init(answers.pattern)
      });
  }

  private async handleArchitectureCommand() {
    const architecture = this.config.defaultArchitecture;
    console.log(architecture)
    if (architecture) {
      await this.enquirer.prompt([
        {
          type: 'confirm',
          name: 'useExisting',
          message: `Ya tienes configurada la arquitectura '${architecture}'. ¿Quieres usar esta configuración?`,
        }
      ]).then((answers: any) => {
        if (answers.useExisting) {
          console.log(`Usando la arquitectura configurada: ${architecture}...`);
          const createArchitectureStructure = new CreateArchitectureStructure()
          createArchitectureStructure.init(architecture);
          this.UsingArchitecture = true;
        }else {
          this.UsingArchitecture = false;
        }
      });
    }
    
    console.log(this.UsingArchitecture)
    if (!this.UsingArchitecture) {
      await this.enquirer.prompt([
        {
          type: "select", // 'select' es equivalente a 'list' en inquirer
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
        .then((answers: any) => {
          console.log(`Inicializando proyecto con la arquitectura ${answers.architecture}...`);
          const createArchitectureStructure = new CreateArchitectureStructure()
          createArchitectureStructure.init(answers.architecture);
          this.config.defaultArchitecture = answers.architecture;
        });
      this.saveConfig();
    }
  }

  public run() {
    this.program.parse(process.argv);
  }
}

const cliApp = CLIApplication.getInstance();
cliApp.run();
