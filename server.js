var Game = require('./Game');

var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log('socket server is running!');

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

var gameArray = [new Game()];
var idDict = {};

function newConnection(socket) {
  var name = Game.generateUsername();
  idDict[socket.id] = name;
  idDict[name] = socket.id;
  console.log('new connection: ' + name + ' (' + socket.id + ')');

  socket.emit('username', name);
  socket.broadcast.emit('new-player', {socketId: socket.id, username: name});
  var clients = Object.keys(io.sockets.sockets);
  io.sockets.emit('players', {clients: clients, idDict: idDict});

  socket.on('draw', onDraw);

  function onDraw(data) {
    console.log('recieving from ' + socket.id);
    console.log(data);
    socket.broadcast.emit('draw', data);
  }

  socket.on('disconnect', onDisconnect);

  function onDisconnect(data) {
    console.log(name + ' is leaving');
    takenNames.splice(takenNames.indexOf(name), 1);
    console.log(takenNames);
    socket.broadcast.emit('leave', socket.id);
  }
}
