// pages/api/scan.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ClassEditDto } from './class-edit.dto';
import { ClassEditorService } from './class-editor.service';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { filePath, className, changes } = req.body as ClassEditDto
        const classEditorService = new ClassEditorService()
        const result = await classEditorService.editClass(filePath, className, changes);
    
        if (result) {
          res.status(200).json({ message: 'Clase editada con éxito' });
        } else {
          res.status(500).json({ message: 'Error al editar la clase' });
        }
}