class TurnManager {
  constructor(playerList) {
    this.current_ = 0;
  }

  nextTurn(announce=true) {
    this.current_++;
    this.current_ %= game.players.length;
    var nextPlayer = this.currentPlayer;
    game.debug.log('player', [this.current_, nextPlayer])
    game.events.turnStart.fire(nextPlayer, announce);
    return nextPlayer;
  }

  nextPlayerPeek() {
    var index = (this.current_ + 1) % game.players.length;
    return game.players[index];
  }

  previousPlayerPeek() {
    var index = (this.current_ + game.players.length - 1)
        % game.players.length;
    return game.players[index];
  }

  get currentPlayer() {
    return game.players[this.current_];
  }

  set currentPlayer(value) {
    this.current_ = game.players.indexOf(value);
  }
}
