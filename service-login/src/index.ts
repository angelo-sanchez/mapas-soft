import app from './app';
import "./database";

let port = parseInt(process.env.PORT || '3000');

app.set('port', port);

export const server = require("http").Server(app);

server.on('error', (err:any) => {
    console.error(JSON.stringify(err));
});
server.on('listening', () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`);
});
server.listen(port);
