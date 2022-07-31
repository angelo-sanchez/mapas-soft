import config from "../config/config";
import * as path from 'path';
import { spawn } from 'child_process';

//TODO: Crear un pool de containers para "cachear" x cantidad de instancias del server
// ideas: usar puertos incrementales, usar una clase, llevar una pool estática...
export const tileserver = {
    start: function (id: string) {
        return new Promise((resolve, reject) => {
            let resolved = false;
            const container = 'tileserver';
            const responseTimer = setTimeout(() => {
                reject("Timeout for response");
            }, 20_000);
            const args = `run --rm -i -v ${path.resolve(config.tileserver.dir)}:/data -p 8080:8080 --name=${container} maptiler/tileserver-gl ${id}.mbtiles`.split(" ");
            this.stop().then(() => {
                const docker = spawn("docker", args);
                docker.on('error', (error) => {
                    console.warn(`Problemas levantando ${container}:`, error.name, error.message);
                });
                docker.stdout.on('data', (data) => {
                    data = `${data}`;
                    data.split(/\r?\n/).forEach((line: string) => {
                        line && console.log(`${container}: ${line}`);
                    });
                    if (data.includes("Listening at") && !resolved) {
                        resolved = true;
                        clearTimeout(responseTimer);
                        resolve(container);
                    }
                });
                docker.stderr.on("data", (data) => {
                    data = `${data}`;
                    data.split(/\r?\n/).forEach((line: string) => {
                        line && console.log(`${container} error: ${line}`);
                    });
                    if (!resolved) {
                        resolved = true;
                        reject(data);
                    }
                });
            });
        });
    },

    stop: function () {
        return new Promise<void>((resolve, reject) => {
            let resolved = false;
            const container = 'tileserver';
            const args = `stop ${container}`.split(" ");
            const docker = spawn("docker", args);
            docker.on('error', (error) => {
                console.warn(`Problemas al terminar ${container}:`, error.name, error.message);
            });
            docker.stdout.on("data", (msg) => {
                console.log(`Parando ${container}: ${msg}`);
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            });
            docker.stderr.on('data', (data) => {
                if (!resolved) {
                    if (data.includes("No such container")) {
                        console.log(`${container} ya está parado.`);
                        resolved = true;
                        resolve();
                    } else {
                        console.error(`${data}`);
                        reject(`${data}`);
                    }
                }
            });
        });
    }
};