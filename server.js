var Game = require('./Game');

var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log('socket server is running!');

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

// var gameArray = [new Game()];
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
    Game.takenNames.splice(Game.takenNames.indexOf(name), 1);
    console.log(Game.takenNames);
    socket.broadcast.emit('leave', socket.id);
  }

  socket.on('next-turn', onNextTurn);

  function onNextTurn(playerName) {
    console.log(playerName + '\'s turn');
    socket.broadcast.emit('next-turn', playerName);
  }

  socket.on('play', onPlay);

  function onPlay(obj) {
    console.log(obj.player.username + ' plays ' + obj.card);
    socket.broadcast.emit('play', obj);
  }
}

/**
var gameArray = [];
gameArray.peek = () => gameArray.length? gameArray[gameArray.length - 1]: null;

console.log('socket server is running!');

function newConnection(socket) {
  var game = gameArray.find(g => !g.isFull());
  if (!game) {
    gameArray.push(game = new Game(socket));
    console.log('new game');
    console.log(gameArray);
  }

  var name = Game.generateUsername();
  game.idDict[socket.id] = name;
  game.idDict[name] = socket.id;

  const broadcast = (...data) => socket.broadcast.in(game.id).emit(...data);
  const broadcastAll = (...data) => io.sockets.in(game.id).emit(...data);

  console.log('new connection: ' + name + ' (' + socket.id + ')');

  socket.emit('username', name);
  socket.emit('game-id', {id: game.id, leader: game.leadPlayerSocket.id});

  broadcast('new-player', {socketId: socket.id, username: name});
  var members = game.members.map(m => m.id);
  socket.emit('players', {members: members, idDict: game.idDict});
  console.log(members.map(id => game.idDict[id]));
*/
