import {Server, Socket} from 'socket.io';

const io = new Server().listen(5000, {transports: ['websocket']});

let isConnected = false;
let connections: { [uuid: string]: any; } = {};

io.on("connection", (socket: Socket) => {
    console.log(`Socket ${socket.id} está conectado.`);
    isConnected = true;
    connections[socket.id] = socket;

    socket.emit("conectado", {conectado: true, id: socket.id});

    socket.on("disconnect", (reason: any) => console.log(socket.id + " DISCONNECTED, REASON: " + reason));
});


export const sockets = {
    listen: function(evt: string, callback: (...args: any[]) => void) {
        if (isConnected) {
            io.addListener(evt, (args) => {
                console.log("Recibiendo: " + JSON.stringify(args));
                callback(args);
            });
        }
    },

    emit: function (eventName: string, payload: any, socketId?: string) {
        console.log(`Emitiendo: ${JSON.stringify(payload)}`);
        if (isConnected) {
            if (socketId) {
                connections[socketId].emit(eventName, payload);
            } else
                io.emit(eventName, payload);
        }
    }
};
