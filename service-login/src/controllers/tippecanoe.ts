import { spawn } from 'child_process';
import path from 'path';
import config from '../config/config';
import { IMap } from '../models/maps.model';
import { type } from "os";
import { sockets } from '../websocket/websocket.handler';


const PROGRESS = "progress";
const FINISH = "finish";
// TO-DO: Todos estos console logs, pueden ser llamados a WebSocket con los resultados.
const showProgress = (command: string, id: string, socketId?: string) => {
    let args = command.split(" ");
    const program = type() == "Windows_NT" ? "powershell" : "sh";
    let process = spawn(program, args);

    sockets.emit(PROGRESS, {
        log: 'Iniciando procesamiento del mapa...',
        id
    }, socketId);

    process.stdout.on('data', (data) => {
        sockets.emit(PROGRESS, {
            log: '' + data,
            id
        }, socketId);
    });

    process.stderr.on('data', (data) => {
        sockets.emit(FINISH, {
            log: '' + data,
            id,
            error: true
        }, socketId);
    });

    process
        .on('exit', (code, signal) => {
            sockets.emit(FINISH, {
                log: 'done',
                id,
                error: false
            }, socketId);
        })
        .on('close', (code, signal) => {
            sockets.emit(FINISH, {
                log: 'done',
                id,
                error: false
            }, socketId);
        });
};

export const tippecanoe = {
    generateMbtiles: async (map: IMap, inputPath: string, socketId?: string) => {
        const outputFolder = path.join(config.tippecanoe.dir, 'output').replace(/\\/g, '/');
        const filename = map.id + '.mbtiles';
        const input = inputPath.replace(config.workdir, config.tippecanoe.dir).replace(/\\/g, "/");
        const outputPath = path.join(outputFolder, filename).replace(/\\/g, "/");
        let prog = path.resolve(config.tippecanoe.command);
        const command = `${prog} ${config.workdir} ${config.tippecanoe.dir} ${outputPath} ${input}`;
        showProgress(command, map.id, socketId);
    },
};
