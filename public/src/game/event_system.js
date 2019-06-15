class ActionList {
  constructor(name, defaultAction=null, hook=null) {
    this.name = name;
    this.listeners_ = defaultAction? [defaultAction]: [];
    this.hook = hook;
  }

  set defaultAction(value) {
    if (!this.listeners_.includes(value)) {
      this.listeners_.push(value);
    }
  }

  add(f) {
    this.listeners_.push(f);
  }

  remove(f) {
    this.listeners_.splice(f);
  }

  clear(f) {
    this.listeners_ = defaultAction? [defaultAction]: [];
  }

  fire(...args) {
    const list = this.listeners_;
    var next = [];
    for (var i = 0, listener; listener = list[i]; i++) {
      var res = listener(...args);

      if (res && this.hook) {
        this.hook(res);
      }

      if (res != REMOVE_ACTION) {
        next.push(listener);
      }
    }

    this.listeners_ = next;
  }
}

const defaultOnPlay = function(card, pile, ...args) {
  game.values[CARDS_PLAYED]++;
  game.debug.log('defaultOnPlay: cards played: ' + game.values[CARDS_PLAYED],
      arguments);

  // if (card.ruleset.onEnter) ...
}

const defaultOnDiscard = function(card, pile, ...args) {
  game.events.play.fire(card, pile, ...args);
  game.values[CARDS_DISCARDED]++;
  game.debug.log('defaultOnDiscard: cards discarded: ' +
        game.values[CARDS_DISCARDED], arguments);
}

const defaultOnDraw = function(card, player, ...args) {
  if (game.values[MUST_PLAYS].includes(card.type)) {
    game.debug.log('forced play', card);
    game.values[CARDS_PLAYED]--;
    autoplay(card);
  }

  game.values[CARDS_DRAWN]++;
  game.debug.log('defaultOnDraw: cards drawn: ' + game.values[CARDS_DRAWN],
      arguments);
}

const defaultOnStart = function(player, ...args) {
  game.debug.log("turn:", player);
  while (game.values[CARDS_TO_DRAW]() > game.values[CARDS_DRAWN]) {
    game.deck.draw(this.player);
  }
}

game.events.draw = new ActionList('draw', defaultOnDraw); //card, player, ...
game.events.play = new ActionList('play', defaultOnPlay); //card, pile, ...

game.events.turnStart = new ActionList('turnStart', defaultOnStart); // player, ...
game.events.steal = new ActionList('steal'); // card, fromPlayer, toPlayer, ...

// not in use currently
game.events.discard = new ActionList('game.game.discard', defaultOnDiscard); //card, pile, ...
game.events.turnEnd = new ActionList('turnEnd'); //card, pile, ...
