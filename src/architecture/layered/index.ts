import path from 'path';
import fs from 'fs';

export class CreateLayeredStructure implements Strategy {
    public doAlgorithm(): void {
      const baseDir = path.join(process.cwd(), 'layered-architecture');
      const layers = ['presentation', 'application', 'domain', 'infrastructure'];
      layers.forEach(layer => {
        const layerDir = path.join(baseDir, layer);
        fs.mkdirSync(layerDir, { recursive: true });
        fs.writeFileSync(path.join(layerDir, `example${layer}.ts`), `// Ejemplo básico para ${layer}`);
      });
      console.log('Estructura de Capas creada en:', baseDir);
    }
}