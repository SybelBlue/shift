class Event {
  constructor(name, defaultAction=null, hook=null) {
    this.name = name;
    this.listeners_ = defaultAction? [defaultAction]: [];
    this.hook = hook;
    this.idList = {};
    this.firing = 0;
  }

  set defaultAction(value) {
    if (!this.listeners_.includes(value)) {
      this.listeners_.push(value);
    }
  }

  add(f) {
    this.listeners_.push(f);
  }

  addWithId(id, f) {
    this.add(f);
    this.idList[id] = f;
  }

  removeWithId(id) {
    this.remove(this.idList[id]);
  }

  remove(f) {
    if (!this.firing) {
      this.listeners_.remove(f);
    } else {
      var n = this.listeners_.indexOf(f);
      if (n < 0) {
        return;
      }
      if (n <= this.counter_) {
        this.counter_--;
      }
      this.listeners_.splice(n, 1);
    }
  }

  clear(f) {
    this.listeners_ = defaultAction? [defaultAction]: [];
  }

  fire(...args) {
    this.fireArgs = args;
    this.firing++;
    this.counter_ = 0;
    this.next_ = [];
    if (this.listeners_.length) {
      this.listeners_[0]((...args) => this.advance_(...args), ...args);
    }
  }

  advance_(result) {
    var listener = this.listeners_[this.counter_];
    if (result !== REMOVE_ACTION) {
      this.next_.push(listener);
    }

    if (result === HALT_FIRE) {
      game.debug.log('halted firing!', listener);
      this.listeners_ = this.next_;
      this.firing--;
      return;
    }

    this.counter_++;
    if (this.counter_ >= this.listeners_.length) {
      this.firing--;
      return;
    }

    this.listeners_[this.counter_](
      (...args) => this.advance_(...args), ...this.fireArgs);
  }
}

const defaultOnPlay = function(callback, player, card, pile, ...args) {
  game.values[CARDS_PLAYED]++;
  game.debug.log('defaultOnPlay: cards played: ' + game.values[CARDS_PLAYED],
      arguments);

  game.desktop.pushPlayString(player, card);

  socket.emit('play', {player: player, card: card.name})
  let finishCallback = () => {
    game.turnManager.turnAutoplay();
    callback(null);
  }

  // if (card.ruleset.onPlay) {
    // card.ruleSet.onPlay(finishCallback)
  // } else {
    finishCallback();
  // }
}

const defaultOnDiscard = function(callback, player, card, pile, ...args) {
  game.events.play.fire(player, card, pile, ...args);
  game.values[CARDS_DISCARDED]++;
  game.debug.log('defaultOnDiscard: cards discarded: ' +
        game.values[CARDS_DISCARDED], arguments);
  callback(null);
}

const defaultOnDraw = function(callback, player, card, ...args) {
  socket.emit('draw', {card: card.name, player: player});
  game.desktop.pushActionString(player, 'draw');

  if (game.values[MUST_PLAYS].includes(card.type)) {
    game.desktop.pushActionString(player, 'run ' + card.name);
    game.debug.log('forced play', card);
    game.values[CARDS_PLAYED]--;
    autoplay(card, true);
    game.deck.draw(player, true);
  }

  game.values[CARDS_DRAWN]++;
  game.debug.log('defaultOnDraw: cards drawn: ' + game.values[CARDS_DRAWN],
      arguments);

  game.turnManager.turnAutoplay();
  callback(null);
}

const defaultOnStartTurn = function(callback, player, announce, ...args) {
  if (announce) {
    socket.emit('next-turn', player.username);
  }

  game.values[CARDS_DRAWN] = 0;
  game.values[CARDS_PLAYED] = 0;
  game.values[CARDS_DISCARDED] = 0;
  game.values[OPTIONALS_PLAYED] = 0;
  game.values[CARD_COUNT_MIN] = game.hand.cards.length;
  game.values[CARD_COUNT_MAX] = game.hand.cards.length;
  game.values[CARD_COUNT_START] = game.hand.cards.length;
  game.turnManager.markAll(false);

  game.toaster.toast(player.username + '\'s turn!');

  if (player === game.mainPlayer) {
    while (game.values[CARDS_TO_DRAW]() > game.values[CARDS_DRAWN]) {
      game.deck.draw(this.player);
    }
  }
  callback(null);
}

const defaultOnTurnEnd = function(callback, player, announce, ...args) {
  game.debug.log('turn-end', arguments);
  callback(null);
}

game.events.draw = new Event('draw', defaultOnDraw); // callback, player, card, ...
game.events.play = new Event('play', defaultOnPlay); // callback, player, card, pile, ...

game.events.steal = new Event('steal'); // callback, card, fromPlayer, toPlayer, ...
game.events.discard = new Event('discard', defaultOnDiscard); // callback, player, card, pile, ...

game.events.turnStart = new Event('turnStart', defaultOnStartTurn); // callback, player, announce, ...
game.events.turnEnd = new Event('turnEnd', defaultOnTurnEnd); // callback, player, announce...
