var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log('socket server is running!');

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

// var gameArray = []

function newConnection(socket) {
  console.log('new connection: ' + socket.id);
  socket.emit('username', Date.now());
  socket.broadcast.emit('new-player', {socketId: socket.id});
  var clients = Object.keys(io.sockets.sockets);
  io.sockets.emit('players', clients);

  socket.on('draw', onDraw);

  function onDraw(data) {
    console.log('recieving from ' + socket.id);
    console.log(data);
    socket.broadcast.emit('draw', data);
  }
}
