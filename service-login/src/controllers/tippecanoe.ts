import { spawn } from 'child_process';
import path from 'path';
import config from '../config/config';
import { IMap } from '../models/maps.model';
import { type } from "os";
import { sockets } from '../websocket/websocket.handler';


const PROGRESS = "progress";
const FINISH = "finish";
// TO-DO: Todos estos console logs, pueden ser llamados a WebSocket con los resultados.
const showProgress = (command: string, map: IMap, socketId?: string) => {
    let args = command.split(" ");
    const program = type() == "Windows_NT" ? "powershell" : "sh";
    let process = spawn(program, args);
    let id = map.id;
    let logs = ["Iniciando procesamiento del mapa..."];
    sockets.emit(PROGRESS, {
        log: 'Iniciando procesamiento del mapa...',
        id
    }, socketId);

    process.stdout.on('data', (data) => {
        let log = '' + data;
        logs.push(log);
        sockets.emit(PROGRESS, {
            log,
            id
        }, socketId);
    });
    let error = false;
    process.stderr.on('data', (data) => {
        error = error || `${data}`.match(/(Warning|Error)/gi) != null;
        error && console.error("...Ocurrio un error...");
        let log = '' + data;
        logs.push(log);
        sockets.emit(PROGRESS, {
            log,
            id
        }, socketId);
    });

    process
        .on('exit', (code, signal) => {
            let log = error ? 'error' : 'done';
            logs.push(log);
            sockets.emit(FINISH, {
                log,
                id,
                error: error,
                ext: error ? null : 'mbtiles'
            }, socketId);

            if(!error)
                map.ext = 'mbtiles';
            map.log = logs;
            map.save();
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
        showProgress(command, map, socketId);
    },
};
