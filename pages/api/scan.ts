// pages/api/scan.ts
import { NextApiRequest, NextApiResponse } from 'next';
import * as SimpleAST from "ts-morph";
import { FileDeclaration, TypeAlias } from './model';
import { ExportGetableNode } from 'ts-morph';
import { parseClasses, parseEnum, parseInterfaces, parseTypes } from './parser/parser';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const ast = getAst("./tsconfig.json", "");
    const files = ast.getSourceFiles();

    const declarations: FileDeclaration[] = files.map(f => {
        let classes = f.getClasses();
        let interfaces = f.getInterfaces();
        let enums = f.getEnums();
        let types = f.getTypeAliases();
        const path = f.getFilePath();
        const functions = f.getFunctions();
        
        //console.log(chalk.yellow(path));
        console.log(functions)
    
        if(false) {
          classes = removeNonExportedNodes(classes);
          interfaces = removeNonExportedNodes(interfaces);
          enums = removeNonExportedNodes(enums);
          types = removeNonExportedNodes(types);
        }
    
        const classDeclarations = classes.map(parseClasses);
        const interfaceDeclarations = interfaces.map(parseInterfaces);
        return {
          fileName: path,
          classes: classDeclarations,
          interfaces: interfaceDeclarations,
          types: types.map(parseTypes).filter(t => t !== undefined) as TypeAlias[],
          type: f.getDirectory() ? 'folder' : 'file',
          enums: enums.map(parseEnum),
          heritageClauses: [
            ...classDeclarations.filter(decl => decl.heritageClauses.length > 0).map(decl => decl.heritageClauses),
            ...interfaceDeclarations.filter(decl => decl.heritageClauses.length > 0).map(decl => decl.heritageClauses)
          ]
        };
      });

    res.status(200).json(declarations);
}


export function getAst(tsConfigPath?: string, sourceFilesPathsGlob?: string) {
    const ast = new SimpleAST.Project({
        tsConfigFilePath: tsConfigPath,
        skipAddingFilesFromTsConfig: !!sourceFilesPathsGlob
    });
    if (sourceFilesPathsGlob) {
        ast.addSourceFilesAtPaths(sourceFilesPathsGlob);
    }
    return ast;
}

function removeNonExportedNodes<T extends ExportGetableNode>(nodes: T[] ): T[] {
    return nodes.filter(n => n.isExported());
  }

