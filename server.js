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
  socket.emit('username', makeUsername());
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

var takenNames = [];
function makeUsername() {
  function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length) % arr.length];
  }
  var adjs = ['ajax', 'automated', 'agile', 'block-chain', 'crowd-sourced',
  'machiine', 'micro', 'nano', 'dynamic', 'cloud-based', 'decentralized',
  'networked', 'crowd-sourced', 'functional', 'algorithmic', 'client-side',
  'uncommented', 'refactored', 'lite', 'propreitary', 'end-to-end', 'buggy',
  'assembled', 'bit-shifted', 'binary', 'remote', 'big-data', 'innovative']
  var nouns = ['giraffe', 'pillow', 'penguin', 'poetry', 'serif',
  'bison', 'dolphin', 'eagle', 'code-monkey', 'shepherd', 'duck', 'bunny',
  'wolf', 'turkey', 'lion', 'piglet', 'snek', 'wrench', 'chicken', 'bolt',
  'tabby', 'corgi', 'hammer', 'pencil', 'dormouse', 'pelican', 'coffee']
  var name = getRandom(adjs) + ' ' + getRandom(nouns);
  while (takenNames.includes(name)) {
    name = getRandom(adjs) + ' ' + getRandom(nouns);
  }
  takenNames.push(name);
  return name;
}
