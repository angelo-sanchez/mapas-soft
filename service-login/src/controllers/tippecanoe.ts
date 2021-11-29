import { spawn } from 'child_process';
import path from 'path';
import config from '../config/config';
import { IMap } from '../models/maps.model';
import { type } from "os";

// TO-DO: Todos estos console logs, pueden ser llamados a WebSocket con los resultados.
const showProgress = (command: string) => {
    let args = command.split(" ");
    const program = type() == "Windows_NT" ? "powershell" : "sh";
    let process = spawn(program, args);

    console.log('Iniciando procesamiento del mapa...');

    process.stdout.on('data', (data) => {
        console.log('' + data);
    });

    process.stderr.on('data', (data) => {
        console.error('' + data);
    });

    process
        .on('exit', (code, signal) => {
            console.log(`El proceso se terminó con un código: ${code} y una signal: ${signal}`);
        })
        .on('close', (code, signal) => {
            console.log(`El proceso finalizó con un código: ${code} y una signal: ${signal}`);
        });
};

export const tippecanoe = {
    generateMbtiles: async (map: IMap, inputPath: string) => {
        const outputFolder = path.join(config.tippecanoe.dir, 'output').replace(/\\/g, '/');
        const filename = map.id + '.mbtiles';
        const input = inputPath.replace(config.workdir, config.tippecanoe.dir).replace(/\\/g, "/");
        const outputPath = path.join(outputFolder, filename).replace(/\\/g, "/");
        let prog = path.resolve(config.tippecanoe.command);
        const command = `${prog} ${config.workdir} ${config.tippecanoe.dir} ${outputPath} ${input}`;
        showProgress(command);
    },
};
