import { Server } from "socket.io";
import { server } from "./app";

const io = new Server(server);
let isConnected = false;

io.on("connection", (socket) => {
    console.log(JSON.stringify(socket));
    isConnected = true;
});

export const socket = {
    listen: function(eventName: string, callback: (...args: any[]) => void) {
        if (isConnected) {
            io.on(eventName, callback);
        }
    },
    
    emit: function(eventName: string, payload: any) {
        if (isConnected) {
            io.emit(eventName, payload);
        }
    }
}

