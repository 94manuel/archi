"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMicroservicesStructure = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class CreateMicroservicesStructure {
    constructor(baseDir = process.cwd(), services = ['users', 'orders']) {
        this.baseDir = path_1.default.join(baseDir, 'microservices');
        this.services = services;
    }
    doAlgorithm() {
        this.services.forEach((service) => {
            const serviceDir = path_1.default.join(this.baseDir, service);
            this.createServiceStructure(serviceDir);
            console.log(`Microservicio '${service}' creado en: ${serviceDir}`);
        });
    }
    createServiceStructure(serviceDir) {
        this.createDirectories(serviceDir);
        this.createFiles(serviceDir);
    }
    createDirectories(serviceDir) {
        const directories = ['controllers', 'routes', 'models', 'services'];
        directories.forEach((dir) => {
            fs_1.default.mkdirSync(path_1.default.join(serviceDir, dir), { recursive: true });
        });
    }
    createFiles(serviceDir) {
        this.createFile(path_1.default.join(serviceDir, 'controllers', 'ExampleController.ts'), this.getControllerContent());
        this.createFile(path_1.default.join(serviceDir, 'routes', 'exampleRoutes.ts'), this.getRoutesContent(serviceDir.split(path_1.default.sep).pop()));
        this.createFile(path_1.default.join(serviceDir, 'models', 'ExampleModel.ts'), this.getModelContent());
        this.createFile(path_1.default.join(serviceDir, 'services', 'ExampleService.ts'), this.getServiceContent());
        this.createFile(path_1.default.join(serviceDir, 'server.ts'), this.getServerContent(serviceDir.split(path_1.default.sep).pop()));
    }
    createFile(filePath, content) {
        fs_1.default.writeFileSync(filePath, content, { encoding: 'utf8' });
    }
    getControllerContent() {
        return `export const getExample = (req, res) => {
    res.json({ message: "Example response" });
};`;
    }
    getRoutesContent(serviceName) {
        return `import { Router } from 'express';
import { getExample } from '../controllers/ExampleController';

const router = Router();

router.get('/${serviceName}', getExample);

export default router;`;
    }
    getModelContent() {
        return `import { Schema, model } from 'mongoose';

const ExampleSchema = new Schema({
    name: String,
    // Define other fields
});

export const ExampleModel = model('Example', ExampleSchema);`;
    }
    getServiceContent() {
        return `// Example service logic here`;
    }
    getServerContent(serviceName) {
        return `import express from 'express';
import exampleRoutes from './routes/exampleRoutes';

const app = express();

app.use(express.json());
app.use('/api/${serviceName}', exampleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Microservice '${serviceName}' running on port \${PORT}\`));`;
    }
}
exports.CreateMicroservicesStructure = CreateMicroservicesStructure;
// Usage:
const generator = new CreateMicroservicesStructure();
generator.doAlgorithm();
