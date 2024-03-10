import path from 'path';
import fs from 'fs';

export class CreateCQRSstructure implements Strategy {
    public doAlgorithm(): void {
        const baseDir = path.join(process.cwd(), 'cqrs-architecture');
        const components = ['commands', 'queries', 'events', 'models'];
        components.forEach(component => {
          const componentDir = path.join(baseDir, component);
          fs.mkdirSync(componentDir, { recursive: true });
          fs.writeFileSync(path.join(componentDir, `example${component}.ts`), `// Ejemplo básico para ${component}`);
        });
        console.log('Estructura CQRS creada en:', baseDir);
    }
}