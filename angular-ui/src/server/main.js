
var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
  
server.listen(8080, function () {
  console.log("Servidor corriendo en http://localhost:8080");
});

var mapas = [
  {
    id: '1',
    name: 'file1',
    date_creation: new Date('24-11-1998').toString(),
    owner: 'yo'
  },
  {
    id: '2',
    name: 'file2',
    date_creation: new Date('25-11-1998').toString(),
    owner: 'yo'
  },
  {
    id: '3',
    name: 'file3',
    date_creation: new Date('26-11-1998').toString(),
    owner: 'yo'
  }
]

io.on("connection", function (socket) {
  console.log("Un cliente se ha conectado");
  socket.emit("mapas", mapas);
});

app.use(express.static('src'))