Array.prototype.peek = function() {
  return this.length? this[this.length - 1]: null;
}

function setup() {
  game.canvas = createCanvas(windowWidth, windowHeight);
  game.canvas.doubleClicked(autoplay);

  textFont(graffiti_text_font);

  game.hand = new Hand();
  game.deck = new Deck();
  game.discard = new Discard();
  game.drawCardPile = makeNewTypedDiscard(Types.draw);
  game.playCardPile = makeNewTypedDiscard(Types.play);
  game.goalCardPile = makeNewTypedDiscard(Types.end);

  game.permaZone = new PermaZone();

  var starters = constructCardArrayFromJSONs(startingCards);
  starters.forEach(autoplay);
  game.values.reset();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  game.hand.position = Hand.defaultPosition();
  game.hand.dimension = Hand.defaultDimensions();
  game.deck.position = Deck.defaultPosition();
  game.discard.position = Discard.defaultPosition();
  game.permaZone.position = PermaZone.defaultPosition();
  game.permaZone.dimension = PermaZone.defaultDimensions();

  game.hand.rearrange();
  game.deck.rearrange();
}

function draw() {
  background(129, 164, 205);

  game.hand.display();
  game.deck.display();
  game.discard.display();

  game.permaZone.display();

  game.typedDiscards.forEach(pile => pile.display());
  game.allCards.filter(card => card.visible && !card.parent)
    .forEach(card => card.display());
  game.selectedStack.reverse().forEach(pile => pile.display());
}

function mouseClicked(e) {
  if (checkClick()) {
    return;
  }

  var card = game.selectedStack.peek();
  if (card && card.isCard() && card.isPerma()) {
    game.permaZone.collect(card);
  }
}

function autoplay(e=undefined) {
  var card = e;
  if (!(card instanceof Card)) {
    card = objectUnderCursor();
    if (!(card instanceof Card)) {
      return;
    }
  }

  game.debug.log('autoplaying', e);
  var candidates = game.typedDiscards.filter(pile => pile.type === card.type);
  switch (candidates.length) {
    case 1:
      candidates[0].collect(card);
      return;
    case 0:
      if (card.canDiscard()) {
        card.discard();
        return;
      } else {
        game.permaZone.collect(card);
        return;
      }
  }
  game.debug.log(card.name + ' fell through', candidates);
}

function makeNewTypedDiscard(type) {
  function getNewTypedDiscardPosition() {
    function sumPile(prop) {
      return game.typedDiscards.map(item => item[prop]).reduce((a, b) => a + b, 0);
    }
    return createVector(10 * (game.typedDiscards.length + 1) + sumPile('width'), 10);
  }
  var pos = getNewTypedDiscardPosition();
  if (type !== Types.end) {
    var item = new TypedDiscard(pos, type);
  } else {
    var item = new GoalDiscard(pos);
  }
  game.typedDiscards.push(item);
  return item;
}
