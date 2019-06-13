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
    for (var i = 0, listener; listener = list[i]; i++) {
      var res;
      if (args.length) {
        res = listener(...args);
      } else {
        res = listener();
      }
      if (res && this.hook) {
        this.hook(res);
      }
    }
  }
}

const defaultOnPlay = function(card, pile, ...args) {
  game.values[CARDS_PLAYED]++;
  game.debug.log('defaultOnPlay: cards played: ' + game.values[CARDS_PLAYED],
      arguments);
}

const defaultOnDiscard = function(card, pile, ...args) {
  game.events.play.fire(card, pile, ...args);
  game.values[CARDS_DISCARDED]++;
  game.debug.log('defaultOnDiscard: cards discarded: ' +
        game.values[CARDS_DISCARDED], arguments);
}

const defaultOnDraw = function(card, ...args) {
  game.values[CARDS_DRAWN]++;
  game.debug.log('defaultOnDraw: cards drawn: ' + game.values[CARDS_DRAWN],
      arguments);
}

game.events.draw = new ActionList('draw', defaultOnDraw);
game.events.play = new ActionList('play', defaultOnPlay);
game.events.discard = new ActionList('game.game.discard', defaultOnDiscard);
