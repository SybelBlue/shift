var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log('socket server is running!');

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

// var gameArray = []
var idDict = {};

function newConnection(socket) {
  var name = makeUsername();
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
  }
}

var takenNames = [];
function makeUsername(push=true) {
  function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length) % arr.length];
  }
  var adjs = ['ajax', 'automated', 'agile', 'block-chain', 'crowd-sourced',
  'machine', 'micro', 'nano', 'dynamic', 'cloud-based', 'decentralized',
  'networked', 'crowd-sourced', 'functional', 'algorithmic', 'client-side',
  'uncommented', 'refactored', 'lite', 'propreitary', 'end-to-end', 'buggy',
  'assembled', 'bit-shifted', 'binary', 'remote', 'big-data', 'innovative',
  'evolving', 'digital', 'virtual', 'front-end', 'back-end', 'lambda',
  'next-gen', '3D', '4D', 'updated', 'data-driven', 'home-edition', 'pro',
  'real-time', 'pioneering', 'planned', 'wooly', 'viral', 'trending']
  var nouns = ['giraffe', 'pillow', 'penguin', 'poetry', 'serif',
  'bison', 'dolphin', 'eagle', 'code-monkey', 'shepherd', 'duck', 'bunny',
  'wolf', 'turkey', 'lion', 'piglet', 'snek', 'wrench', 'chicken', 'bolt',
  'tabby', 'corgi', 'hammer', 'pencil', 'dormouse', 'pelican', 'coffee',
  'mammoth', 'obsolescence', 'caracal', 'ocelot', 'serval', 'bengal',
  'kookaburra', 'puppy']
  var name = getRandom(adjs) + ' ' + getRandom(nouns);
  while (takenNames.includes(name)) {
    name = getRandom(adjs) + ' ' + getRandom(nouns);
  }

  if (push) {
    takenNames.push(name);
  }

  return name;
}
