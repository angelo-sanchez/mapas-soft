import config from '../config/config';
import { IMap } from '../models/maps.model';
import { join } from 'path';
import { spawn } from 'child_process';

// TO-DO: Todos estos console logs, pueden ser llamados a WebSocket con los resultados.
const showProgress = (command: string) => {
    let process = spawn(command);

    console.log('Iniciando procesamiento del mapa...');

    process.stdout.on('data', (data) => {
        console.log(data);
    });

    process.stderr.on('data', (data) => {
        console.error(data);
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
        const filename = map.id + '.mbtiles';
        const outputPath = join(config.workdir, 'output', filename);
        const command = `${config.command} -o ${outputPath} ${inputPath}`;
        showProgress(command);
    },
};
