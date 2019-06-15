function setup() {
  game.canvas = createCanvas(windowWidth, windowHeight);
  game.canvas.doubleClicked(autoplay);

  textFont(main_font);

  game.hand = new Hand();
  game.deck = new Deck();
  game.discard = new Discard();
  game.drawCardPile = makeNewTypedDiscard(Types.draw);
  game.playCardPile = makeNewTypedDiscard(Types.play);
  game.goalCardPile = makeNewTypedDiscard(Types.end);

  game.desktop = new Desktop();

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
  game.desktop.position = Desktop.defaultPosition();
  game.desktop.dimension = Desktop.defaultDimensions();

  game.hand.rearrange();
  game.deck.rearrange();
}

function draw() {
  background(129, 164, 205);

  game.deck.display();
  game.discard.display();
  game.desktop.display();
  game.hand.display();

  game.typedDiscards.forEach(pile => pile.display());
  game.allCards.filter(card => card.visible && !card.parent)
    .forEach(card => card.display());
  game.selectedStack.reverse().forEach(pile => pile.display());

  if (!(frameCount % 10)) {
    // checkHover();
  }
  game.avgFrameRate = ((game.avgFrameRate || 0) * (frameCount - 1) + getFrameRate()) 
    / frameCount;
}

function checkHover() {
  var object = objectUnderCursor();

  if (object != game.lastHovered && game.lastHovered) {
    game.lastHovered.hover = false;
  }

  if (object instanceof Card) {
    object.hover = true;
    game.lastHovered = object;
  }
}

function mouseClicked(e) {
  if (checkClick()) {
    return;
  }

  var card = game.selectedStack.peek();
  if (card && card.isCard() && card.isPerma()) {
    game.desktop.collect(card);
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
        game.desktop.collect(card);
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
