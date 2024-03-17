// pages/api/extractFeatures.ts

import type { NextApiRequest, NextApiResponse } from 'next';

interface Property {
    name: string;
}

interface Method {
    name: string;
}

interface Class {
    properties: Property[];
    methods: Method[];
}

interface DataItem {
    classes: Class[];
}

// La función que procesa la solicitud POST
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Asegúrate de que solo se permitan solicitudes POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    // Extraer el cuerpo de la solicitud, que se espera que sea un JSON con la estructura de DataItem[]
    const data: DataItem[] = req.body;

    // Función para extraer características
    const extractFeatures = (data: DataItem[]): string[] => {
        let features: string[] = [];

        data.forEach(item => {
          item.classes.forEach(cls => {
            let classFeatures: string[] = [];
      
            // Extrae los nombres de las propiedades
            cls.properties.forEach(prop => {
              classFeatures.push(prop.name);
            });
      
            // Extrae los nombres de los métodos
            cls.methods.forEach(method => {
              classFeatures.push(method.name);
            });
      
            // Une todas las características extraídas con espacio y las agrega al array de features
            features.push(classFeatures.join(' '));
          });
        });

        return features;
    };

    // Llamada a la función extractFeatures y captura del resultado
    const features = extractFeatures(data);

    // Envío de la respuesta con las características extraídas
    res.status(200).json({ features });
}
