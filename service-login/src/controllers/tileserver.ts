import config from "../config/config";
import * as path from 'path';
import { spawn } from 'child_process';
const buscarPuerto = (containers: Containers) : number => {
    const contenedores = Object.values(containers);
    let port = config.tileserver.basePort + contenedores.length;
    const ports = contenedores.map(c => c.port);
    if (ports.includes(port)) { // Si el puerto ya está en uso, busco uno libre
        const set = new Set(ports);
        for (let i = 0; i < set.size; i++) {
            if (!set.has(config.tileserver.basePort + i)) {
                port = config.tileserver.basePort + i;
                break;
            }
        }
    }
    return port;
}
//TODO: Crear un pool de containers para "cachear" x cantidad de instancias del server
// ideas: usar puertos incrementales, usar una clase, llevar una pool estática...
declare type Containers = {
    [key: string]: {
        port: number,
        listeners: number,
    }
}
export const tileserver = {
    containers: <Containers>{},
    start: function (id: string) {
        return new Promise<{name:string, port:number}>((resolve, reject) => {
            let resolved = false;
            const container = `tileserver_${id}`;
            const responseTimer = setTimeout(() => {
                reject(new Error("Timeout for response"));
            }, 20_000);
            if(this.containers[id]){
                this.containers[id].listeners++;
                resolve({name: container, port: this.containers[id].port});
                return;
            }
            const port = buscarPuerto(this.containers);
            const args = `run --rm -i -v ${path.resolve(config.tileserver.dir)}:/data -p ${port}:8080 --name=${container} maptiler/tileserver-gl ${id}.mbtiles`.split(" ");
            this.stop(id).then(() => {
                this.containers[id] = {port, listeners: 1};
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
                        resolve({name: container, port});
                    }
                });
                docker.stderr.on("data", (data) => {
                    data = `${data}`;
                    data.split(/\r?\n/).forEach((line: string) => {
                        line && console.log(`${container} error: ${line}`);
                    });
                    if(data.includes("is in use by container")) {
                        console.error(`El container name ${container} ya está en uso.`);
                        this.containers[id] = {port, listeners: 1};
                        const dockerPort = spawn("docker", `port ${container}`.split(" "));
                        dockerPort.stdout.on("data", (data) => {
                            resolved = true;
                            clearTimeout(responseTimer);
                            resolve({name: container, port: parseInt(`${data}`.split(":")[1])});
                        });
                    }
                    if(data.includes("port is already allocated") && !resolved) {
                        console.error(`El puerto ${port} ya está en uso.`);
                        this.containers[port] = {port, listeners: 1};
                        resolve(this.start(id));
                    }
                    if (!resolved) {
                        resolved = true;
                        reject(data);
                    }
                });
            });
        });
    },

    stop: function (id: string) {
        return new Promise<void>((resolve, reject) => {
            let resolved = false;
            const container = `tileserver_${id}`;
            // Si no existe el container, no hay nada que hacer
            if(!this.containers[id]){
                resolve();
                return;
            }
            // Si hay más de un listener, no se puede parar
            if(--(this.containers[id].listeners) > 0){
                resolve();
                return;
            }
            // Si no hay más listeners, se puede parar y borrar el container
            delete this.containers[id];

            const docker = spawn("docker", ["stop", container]);
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