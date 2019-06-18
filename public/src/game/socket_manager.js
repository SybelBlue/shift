var socket;
function makeSocket() {
  socket = io.connect('http://localhost:3000');
  socket.on('new-player', onNewPlayer);
  socket.on('username', onUsername);
  socket.on('players', onPlayersAnnounce);
  socket.on('draw', onDraw);
  socket.on('play', onPlay);
  socket.on('leave', onDisconnect);
  socket.on('next-turn', onNextTurn);
}

const onNewPlayer = (data) => {
  game.toaster.toast(
    data.username + ' has entered the game!', color(50, 250, 100));
  game.desktop.pushActionString(data, 'join');
}

const onUsername = name => game.username = name;

const onPlayersAnnounce = (data) => {
  var keys = data.clients;
  game.players = keys.map(k => new Player(k, data.idDict[k]));
  game.mainPlayer = game.players.find(p => p.socketid == socket.id);
}

const onDraw = (data) => {
  var card = getCardFromName(data.card);
  game.debug.log('recieving draw: ' + data.card, card);
  game.desktop.pushActionString(data.player, 'draw');
  game.deck.remove(data.card);
}

const onPlay = (data) => {
  game.debug.log('recieving draw', data);
  game.desktop.pushPlayString(data.player, getCardFromName(data.card));
  var card = getCardFromName(data.card);
  if (card.publicPlay()) {
    autoplay(card, true, false);
  }
}

const onDisconnect = (socketId) => {
  var out = game.players.find(p => p.socketid === socketId);
  game.toaster.toast(out.username + " has left the game!", color(250, 100, 50));
  game.desktop.pushActionString(out, 'quit');
  game.turnManager.removePlayer(out);
}

const onNextTurn = (playerName) => {
  game.debug.log('recieving turn start', playerName);
  game.turnManager.nextTurn(false);
}
