class TurnManager {
  constructor(playerList) {
    this.current_ = 0;
    this.optionals_ = [];
  }

  nextTurn(announce=true) {
    game.events.turnEnd.fire(this.currentPlayer, announce);
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
      this.current_ += game.players.length - 1;
    }
    this.current %= game.players.length;
    game.players.splice(index, 1);
  }

  addOptional(source, action) {
    this.optionals_.push({src: source, fn: action, done: false})
  }

  doOptional(source, ...args) {
    var obj = this.optionals_.find(obj => source === obj.src);

    if (!obj.done) {
      obj.fn(...args);
      obj.done = true;
      game.values[OPTIONALS_PLAYED]++;
    }

    this.turnAutoplay();
  }

  turnAutoplay() {
    if (this.turnCanEnd()) {
      this.nextTurn();
    }
  }

  turnCanEnd() {
    if (game.values[OPTIONALS_PLAYED] < this.optionals_.length) {
      game.debug.log('turnautoplay-reject', 'optionals to play');
      return false;
    }

    if (game.values[CARDS_TO_PLAY]() > game.values[CARDS_PLAYED]) {
      game.debug.log('turnautoplay-reject', 'cards to play');
      return false;
    }

    if (game.values[CARDS_TO_DRAW]() > game.values[CARDS_DRAWN]) {
      game.debug.log('turnautoplay-reject', 'cards to draw');
      return false;
    }

    return true;
  }

  markAll(isDone) {
    this.optionals_.forEach(obj => obj.src = isDone);
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
