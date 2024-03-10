"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHexagonalStructure = exports.CreateHexagonalStructurse = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CreateHexagonalStructurse {
    doAlgorithm() {
        const baseDir = path_1.default.join(process.cwd(), 'hexagonal-architecture');
        const layers = ['application', 'domain', 'infrastructure'];
        layers.forEach(layer => {
            const layerDir = path_1.default.join(baseDir, layer);
            fs_1.default.mkdirSync(layerDir, { recursive: true });
            fs_1.default.writeFileSync(path_1.default.join(layerDir, `example${layer}.ts`), `// Ejemplo básico para ${layer}`);
        });
        console.log('Estructura Hexagonal creada en:', baseDir);
    }
}
exports.CreateHexagonalStructurse = CreateHexagonalStructurse;
class CreateHexagonalStructure {
    constructor() {
        this.baseDir = path_1.default.join(process.cwd(), 'hexagonal-architecture');
    }
    doAlgorithm() {
        this.createDirectories();
        this.createFiles();
        console.log('Estructura Hexagonal creada en:', this.baseDir);
    }
    createDirectories() {
        const directories = [
            'application/use_cases',
            'domain/entities',
            'domain/repositories',
            'infrastructure/config',
            'infrastructure/db',
            'infrastructure/web',
        ];
        directories.forEach((dir) => {
            fs_1.default.mkdirSync(path_1.default.join(this.baseDir, dir), { recursive: true });
        });
    }
    createFiles() {
        this.createFile('domain/entities/User.ts', this.getUserEntityContent());
        this.createFile('domain/repositories/UserRepository.ts', this.getUserRepositoryContent());
        this.createFile('infrastructure/db/MongoUserRepository.ts', this.getMongoUserRepositoryContent());
        this.createFile('application/use_cases/CreateUser.ts', this.getCreateUserUseCaseContent());
        this.createFile('infrastructure/web/UserController.ts', this.getUserControllerContent());
        this.createFile('infrastructure/web/Server.ts', this.getServerContent());
        this.createFile('infrastructure/config/index.ts', this.getConfigContent());
        this.createFile('index.ts', this.getIndexContent());
    }
    createFile(filePath, content) {
        fs_1.default.writeFileSync(path_1.default.join(this.baseDir, filePath), content);
    }
    getUserEntityContent() {
        return `export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
    ) {}
}`;
    }
    getUserRepositoryContent() {
        return `import { User } from '../entities/User';

export interface UserRepository {
    add(user: User): Promise<void>;
    findById(userId: string): Promise<User | null>;
}`;
    }
    getMongoUserRepositoryContent() {
        return `import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    // other fields...
});

const UserModel = mongoose.model('User', UserSchema);

export class MongoUserRepository implements UserRepository {
    async add(user: User): Promise<void> {
        const mongooseUser = new UserModel(user);
        await mongooseUser.save();
    }

    async findById(userId: string): Promise<User | null> {
        const user = await UserModel.findById(userId);
        if (!user) {
            return null;
        }
        return new User(user.id, user.name, user.email);
    }
}`;
    }
    getCreateUserUseCaseContent() {
        return `import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class CreateUser {
    constructor(private userRepository: UserRepository) {}

    async execute(name: string, email: string): Promise<void> {
        const user = new User(Date.now().toString(), name, email);
        await this.userRepository.add(user);
    }
}`;
    }
    getUserControllerContent() {
        return `import { Request, Response } from 'express';
import { CreateUser } from '../../application/use_cases/CreateUser';
import { MongoUserRepository } from '../db/MongoUserRepository';

export class UserController {
    static async createUser(req: Request, res: Response) {
        const { name, email } = req.body;
        const userRepository = new MongoUserRepository();
        const createUser = new CreateUser(userRepository);

        await createUser.execute(name, email);

        res.status(201).json({ message: 'User created successfully' });
    }
}`;
    }
    getServerContent() {
        return `import express, { Application } from 'express';
import { UserController } from './UserController';

const app: Application = express();

app.use(express.json());

app.post('/users', UserController.createUser);

// other routes...

export default app;`;
    }
    getConfigContent() {
        return `export const config = {
    mongoUrl: 'mongodb://localhost:27017/hexagonal',
    port: 3000,
};`;
    }
    getIndexContent() {
        return `import app from './infrastructure/web/Server';
    import mongoose from 'mongoose';
    import { config } from './infrastructure/config';
    
    const startApplication = async () => {
        try {
            await mongoose.connect(config.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('Connected to MongoDB');
    
            app.listen(config.port, () => {
                console.log(\`Server running on http://localhost:\${config.port}\`);
            });
        } catch (error) {
            console.error('Failed to connect to MongoDB', error);
            process.exit(1); // Exit with failure
        }
    };
    
    startApplication();`;
    }
}
exports.CreateHexagonalStructure = CreateHexagonalStructure;
// Uso:
const hexagonalStructure = new CreateHexagonalStructure();
hexagonalStructure.doAlgorithm();
