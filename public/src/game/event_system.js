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

      if (res !== REMOVE_ACTION) {
        next.push(listener);
      }

      if (res === HALT_FIRE) {
        game.debug.log('halted firing!', listener);
        return;
      }
    }

    this.listeners_ = next;
  }
}

const defaultOnPlay = function(player, card, pile, ...args) {
  game.values[CARDS_PLAYED]++;
  game.debug.log('defaultOnPlay: cards played: ' + game.values[CARDS_PLAYED],
      arguments);

  game.desktop.pushPlayString(player, card);

  socket.emit('play', {player: player, card: card.name})
  // if (card.ruleset.onEnter) ...

  game.turnManager.turnAutoplay();
}

const defaultOnDiscard = function(player, card, pile, ...args) {
  game.events.play.fire(player, card, pile, ...args);
  game.values[CARDS_DISCARDED]++;
  game.debug.log('defaultOnDiscard: cards discarded: ' +
        game.values[CARDS_DISCARDED], arguments);
}

const defaultOnDraw = function(player, card, ...args) {
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
}

const defaultOnStartTurn = function(player, announce, ...args) {
  if (announce) {
    socket.emit('next-turn', player.username);
  }

  game.values[CARDS_DRAWN] = 0;
  game.values[CARDS_PLAYED] = 0;
  game.values[CARDS_DISCARDED] = 0;
  game.values[OPTIONALS_PLAYED] = 0;

  game.turnManager.markAll(false);

  game.toaster.toast(player.username + '\'s turn!');

  if (player === game.mainPlayer) {
    while (game.values[CARDS_TO_DRAW]() > game.values[CARDS_DRAWN]) {
      game.deck.draw(this.player);
    }
  }
}

const defaultOnTurnEnd = function(player, announce, ...args) {
  game.debug.log('turn-end', arguments);

}

game.events.draw = new ActionList('draw', defaultOnDraw); // player, card, ...
game.events.play = new ActionList('play', defaultOnPlay); // player, card, pile, ...

game.events.steal = new ActionList('steal'); // card, fromPlayer, toPlayer, ...
game.events.discard = new ActionList('discard', defaultOnDiscard); //player, card, pile, ...

game.events.turnStart = new ActionList('turnStart', defaultOnStartTurn); // player, announce, ...
game.events.turnEnd = new ActionList('turnEnd', defaultOnTurnEnd); // player, announce...
