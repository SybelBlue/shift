class TurnManager {
  constructor(playerList) {
    this.current_ = 0;
  }

  nextTurn(announce=true) {
    this.current_++;
    this.current_ %= game.players.length;
    var nextPlayer = this.currentPlayer;
    game.debug.log('nextturn', [this.current_, nextPlayer])
    game.events.turnStart.fire(nextPlayer, announce);
    return nextPlayer;
  }

  /** main player's turn? */
  isMainTurn() {
    return this.currentPlayer === game.mainPlayer;
  }

  removePlayer(player) {
    var index = game.players.indexOf(player);
    if (index < this.current_) {
      this.current_--;
    }
    game.players.splice(index, 1);
  }

  get nextPlayer() {
    var index = (this.current_ + 1) % game.players.length;
    return game.players[index];
  }

  get previousPlayer() {
    var index = (this.current_ + game.players.length - 1) % game.players.length;
    return game.players[index];
  }

  get currentPlayer() {
    return game.players[this.current_];
  }

  set currentPlayer(value) {
    this.current_ = game.players.indexOf(value);
  }
}
