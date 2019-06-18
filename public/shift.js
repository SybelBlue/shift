/**
// TODO: list

// view discard
// matchmaking
// async deck sync
// ruleset encoding scheme
// task manager: timer card indicator

*/

function setup() {
  game.canvas = createCanvas(Math.max(60 + 5 * DECK_WIDTH, windowWidth),
    Math.max(40 + 3.5 * DECK_HEIGHT, windowHeight));
  game.canvas.doubleClicked(autoplay);

  textFont(main_font);

  game.selectedStack = new SelectionStack();
  game.turnManager = new TurnManager(game.players);
  game.toaster = new Toaster();
  game.hand = new Hand(game.mainPlayer);
  game.deck = new Deck();
  game.discard = new Discard();
  game.drawCardPile = makeNewTypedDiscard(Types.draw);
  game.playCardPile = makeNewTypedDiscard(Types.play);
  game.goalCardPile = makeNewTypedDiscard(Types.end);
  game.exileField = new PlayableField(PlayableField.defaultExilePosition());

  game.desktop = new Desktop();

  var starters = constructCardArrayFromJSONs(startingCards);
  starters.forEach(autoplay);
  game.values.reset();

  game.toaster.toast('You, ' + game.mainPlayer.username +
      ', have joined the game!');
  game.events.turnStart.fire(game.turnManager.currentPlayer);

  game.deck.draw();
  game.deck.draw();
  game.deck.draw();
  game.deck.draw();
}

function windowResized() {
  resizeCanvas(Math.max(60 + 5 * DECK_WIDTH, windowWidth),
    Math.max(40 + 3.5 * DECK_HEIGHT, windowHeight));
  game.hand.position = game.hand.refreshPosition();
  game.hand.dimension = Hand.defaultDimensions();
  game.hand.popUp.dimension = HandPopupDisplay.defaultDimensions();
  game.hand.popUp.position = HandPopupDisplay.defaultPosition();
  game.deck.position = Deck.defaultPosition();
  game.discard.position = Discard.defaultPosition();
  game.desktop.position = Desktop.defaultPosition();
  game.desktop.dimension = Desktop.defaultDimensions();

  game.hand.rearrange();
  game.deck.rearrange();
}

function draw() {
  background(129, 164, 205);

  game.exileField.display();
  game.deck.display();
  game.discard.display();
  game.desktop.display();
  game.hand.display();

  game.typedDiscards.forEach(pile => pile.display());
  game.allCards.filter(card => card.visible && !card.parent)
    .forEach(card => card.display());
  game.selectedStack.reverse().forEach(item => item.display());

  if (!(frameCount % 10)) {
    checkHover();
  }

  game.toaster.display();

  if (game.lastHovered) {
    game.lastHovered.display();
  }

  updateAvgFrameRate();
}

function autoplay(e=undefined, force=false, announce=true) {
  var card = e;
  if (!(card instanceof Card)) {
    card = objectUnderCursor();
    if (!(card instanceof Card) || !card.interactable) {
      return;
    }
  }

  game.debug.log('autoplaying', e);

  if (!force && game.values[CARDS_PLAYED] >= game.values[CARDS_TO_PLAY]()) {
    game.debug.log('reject, too many cards played');
    card.shake();
    return;
  }

  if (game.mainPlayer !== game.turnManager.currentPlayer) {
    if (!force) {
      game.debug.log('reject, not your turn!');
      card.shake();
      return;
    } else {
      game.values[CARDS_PLAYED]--;
    }
  }

  var candidates = game.typedDiscards.filter(pile => pile.type === card.type);
  switch (candidates.length) {
    case 1:
      candidates[0].collect(card, true, announce);
      return;
    case 0:
      if (card.canDiscard()) {
        card.discard(announce);
        return;
      } else {
        game.desktop.collect(card, announce);
        return;
      }
  }
  game.debug.log(card.name + ' fell through', candidates);
}
