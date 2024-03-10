"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatecleanArchitectureStructure = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class CreatecleanArchitectureStructure {
    constructor(baseDir = process.cwd()) {
        this.baseDir = path_1.default.join(baseDir, 'clean-architecture');
    }
    doAlgorithm() {
        this.createDirectories();
        this.createFiles();
        console.log('Estructura de Arquitectura Limpia creada en:', this.baseDir);
    }
    createDirectories() {
        const directories = [
            'application/use_cases',
            'domain/entities',
            'domain/repositories',
            'infrastructure/database/models',
            'infrastructure/web/routes',
            'infrastructure/web/middleware',
            'interfaces/controllers'
        ];
        directories.forEach((dir) => {
            fs_1.default.mkdirSync(path_1.default.join(this.baseDir, dir), { recursive: true });
        });
    }
    createFiles() {
        const files = {
            'domain/entities/User.ts': this.getUserEntityContent(),
            'domain/repositories/IUserRepository.ts': this.getIUserRepositoryContent(),
            'infrastructure/database/models/UserModel.ts': this.getUserModelContent(),
            'infrastructure/database/MongooseUserRepository.ts': this.getMongooseUserRepositoryContent(),
            'application/use_cases/CreateUser.ts': this.getCreateUserUseCaseContent(),
            'interfaces/controllers/UserController.ts': this.getUserControllerContent(),
            'infrastructure/web/routes/userRoutes.ts': this.getUserRoutesContent(),
            'infrastructure/web/server.ts': this.getServerContent(),
            'infrastructure/web/middleware/errorMiddleware.ts': this.getErrorMiddlewareContent(),
            'index.ts': this.getIndexContent()
        };
        Object.entries(files).forEach(([filePath, content]) => {
            this.createFile(filePath, content);
        });
    }
    createFile(filePath, content) {
        fs_1.default.writeFileSync(path_1.default.join(this.baseDir, filePath), content, { encoding: 'utf8' });
    }
    getUserEntityContent() {
        return `export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string
    ) {}
}`;
    }
    getIUserRepositoryContent() {
        return `import { User } from '../entities/User';

export interface IUserRepository {
    add(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
}`;
    }
    getUserModelContent() {
        return `import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }
});

export default mongoose.model<IUser>('User', UserSchema);`;
    }
    getMongooseUserRepositoryContent() {
        return `import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import UserModel from '../database/models/UserModel';

export class MongooseUserRepository implements IUserRepository {
    async add(user: User): Promise<void> {
        const newUser = new UserModel({
            name: user.name,
            email: user.email
        });
        await newUser.save();
    }

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findById(id);
        if (!user) return null;
        return new User(user.id, user.name, user.email);
    }
}`;
    }
    getCreateUserUseCaseContent() {
        return `import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class CreateUser {
    constructor(private userRepository: IUserRepository) {}

    async execute(name: string, email: string): Promise<void> {
        const user = new User(Date.now().toString(), name, email);
        await this.userRepository.add(user);
    }
}`;
    }
    getUserControllerContent() {
        return `import { Request, Response } from 'express';
import { CreateUser } from '../../application/use_cases/CreateUser';
import { MongooseUserRepository } from '../../infrastructure/database/MongooseUserRepository';

export async function createUser(req: Request, res: Response) {
    const { name, email } = req.body;
    const userRepository = new MongooseUserRepository();
    const createUserUseCase = new CreateUser(userRepository);

    await createUserUseCase.execute(name, email);

    res.status(201).send({ message: 'User created successfully' });
}`;
    }
    getUserRoutesContent() {
        return `import { Router } from 'express';
import * as UserController from '../../interfaces/controllers/UserController';

const router = Router();

router.post('/users', UserController.createUser);

export default router;`;
    }
    getServerContent() {
        return `import express from 'express';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorMiddleware';

const app = express();

app.use(express.json());

app.use('/api', userRoutes);

app.use(errorHandler);

export default app;`;
    }
    getErrorMiddlewareContent() {
        return `import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
}`;
    }
    getIndexContent() {
        return `import app from './infrastructure/web/server';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/clean-architecture';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(\`Server running on port \${PORT}\`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });`;
    }
}
exports.CreatecleanArchitectureStructure = CreatecleanArchitectureStructure;
// Usage:
const generator = new CreatecleanArchitectureStructure();
generator.doAlgorithm();
