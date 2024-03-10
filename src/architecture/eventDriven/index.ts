import path from 'path';
import fs from 'fs';

export class CreateEventDrivenStructure implements Strategy {
    public doAlgorithm(): void {
      const baseDir = path.join(process.cwd(), 'event-driven-architecture');
      const components = ['events', 'eventHandlers', 'aggregates'];
      components.forEach(component => {
        const componentDir = path.join(baseDir, component);
        fs.mkdirSync(componentDir, { recursive: true });
        fs.writeFileSync(path.join(componentDir, `example${component}.ts`), `// Ejemplo básico para ${component}`);
      });
      console.log('Estructura Orientada a Eventos creada en:', baseDir);
    }
}