import fs from 'fs';
import path from 'path';

export class CreateMicroservicesStructure implements Strategy {
    private baseDir: string;
    private services: string[];

    constructor(baseDir: string = process.cwd(), services: string[] = ['users', 'orders']) {
        this.baseDir = path.join(baseDir, 'microservices');
        this.services = services;
    }

    public doAlgorithm() {
        this.services.forEach((service) => {
            const serviceDir = path.join(this.baseDir, service);
            this.createServiceStructure(serviceDir);
            console.log(`Microservicio '${service}' creado en: ${serviceDir}`);
        });
    }

    private createServiceStructure(serviceDir: string) {
        this.createDirectories(serviceDir);
        this.createFiles(serviceDir);
    }

    private createDirectories(serviceDir: string) {
        const directories = ['controllers', 'routes', 'models', 'services'];

        directories.forEach((dir) => {
            fs.mkdirSync(path.join(serviceDir, dir), { recursive: true });
        });
    }

    private createFiles(serviceDir: string) {
        this.createFile(path.join(serviceDir, 'controllers', 'ExampleController.ts'), this.getControllerContent());
        this.createFile(path.join(serviceDir, 'routes', 'exampleRoutes.ts'), this.getRoutesContent(serviceDir.split(path.sep).pop() as string));
        this.createFile(path.join(serviceDir, 'models', 'ExampleModel.ts'), this.getModelContent());
        this.createFile(path.join(serviceDir, 'services', 'ExampleService.ts'), this.getServiceContent());
        this.createFile(path.join(serviceDir, 'server.ts'), this.getServerContent(serviceDir.split(path.sep).pop() as string));
    }

    private createFile(filePath: string, content: string) {
        fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    }

    private getControllerContent() {
        return `export const getExample = (req, res) => {
    res.json({ message: "Example response" });
};`;
    }

    private getRoutesContent(serviceName: string) {
        return `import { Router } from 'express';
import { getExample } from '../controllers/ExampleController';

const router = Router();

router.get('/${serviceName}', getExample);

export default router;`;
    }

    private getModelContent() {
        return `import { Schema, model } from 'mongoose';

const ExampleSchema = new Schema({
    name: String,
    // Define other fields
});

export const ExampleModel = model('Example', ExampleSchema);`;
    }

    private getServiceContent() {
        return `// Example service logic here`;
    }

    private getServerContent(serviceName: string) {
        return `import express from 'express';
import exampleRoutes from './routes/exampleRoutes';

const app = express();

app.use(express.json());
app.use('/api/${serviceName}', exampleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Microservice '${serviceName}' running on port \${PORT}\`));`;
    }
}

// Usage:
const generator = new CreateMicroservicesStructure();
generator.doAlgorithm();
