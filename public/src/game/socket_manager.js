var socket;
function makeSocket() {
  socket = io.connect('http://localhost:3000');
  socket.on('new-player', onNewPlayer);
  socket.on('username', onUsername);
  socket.on('players', onPlayersAnnounce);
  socket.on('draw', onDraw);
  socket.on('play', onPlay);
  socket.on('leave', onDisconnect)
}

const onNewPlayer = (data) => {
  game.toaster.toast(
    data.username + ' has entered the game!', color(50, 250, 100));
}

const onUsername = name => game.username = name;

const onPlayersAnnounce = (data) => {
  var keys = data.clients;
  game.players = keys.map(k => new Player(k, data.idDict[k]));
  game.mainPlayer = game.players.find(p => p.socketid == socket.id);
}

const onDraw = (data) => {
  var card = game.allCards.find(c => c.name == data.card);
  game.debug.log('recieving draw', card);
  if (card.type === Types.virus) {
    game.toaster.toast(data.player.username + ' drew ' + card.name);
  } else {
      game.toaster.toast(data.player.username + ' draws...');
  }
  game.deck.remove(data.card);
}

const onPlay = (data) => {
  game.debug.log('recieving draw', data);
  game.toaster.toast(data.player.username + ' played ' + data.card);
  game.deck.remove(data.card);
}

const onDisconnect = (socketId) => {
  var out = game.players.find(p => p.socketid === socketId);
  game.toaster.toast(out.username + " has left the game!", color(250, 100, 50));
  game.players.splice(game.players.indexOf(out), 1);
}
