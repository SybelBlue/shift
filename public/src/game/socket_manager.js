var socket;
function makeSocket() {
  socket = io.connect('http://localhost:3000');
  socket.on('new-player', onNewPlayer);
  socket.on('username', onUsername);
  socket.on('players', onPlayersAnnounce);
  socket.on('draw', onDraw)
  socket.on('play', onPlay);
}

const onNewPlayer = (data) => {
  game.toast.toast(data.username + ' has entered');
}

const onUsername = name => game.username = name;

const onPlayersAnnounce = (data) => {
  var keys = data.clients;
  var dict = data.idDict;
  game.players = keys.map(k => new Player(k, dict[k]));
  game.clientPlayer = game.players.find(p => p.socketid == socket.id);
}

const onDraw = (data) => {
  game.debug.log('recieving draw', data);
  game.toast.toast(data.player.username + ' draws!');
  game.deck.remove(data.card);
}

const onPlay = (data) => {
  game.debug.log('recieving draw', data);
  game.toast.toast(data.player.username + ' played ' + data.card);
  game.deck.remove(data.card);
}
