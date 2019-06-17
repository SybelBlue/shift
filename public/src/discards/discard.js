class Discard extends PlayableField {
  constructor(position=Discard.defaultPosition()) {
    super(position);
  }

  rearrange() {
    var loc = createVector(this.x + (DECK_WIDTH - CARD_WIDTH)/2,
        this.y + (DECK_HEIGHT - CARD_HEIGHT) / 2);
    this.cards.forEach(card => card.lerpTo(loc));
  }

  collect(card, flipped=true, fire=true) {
    super.collect(card);
    card.flipped = flipped;
    card.visible = true;
    card.interactable = false;
    if (fire) {
      game.events.discard.fire(game.mainPlayer, card, this);
    }
  }

  select() {
    game.selectedStack.pop();  // self
    if (!game.selectedStack.length) {
      return;
    }
    var card = game.selectedStack.pop();
    if (!card.canDiscard()) {
      game.selectedStack.push(card);
      return;
    }
    this.collect(card);
  }

  static defaultPosition() {
    return createVector(Deck.defaultPosition().x - DECK_WIDTH - 10, 10);
  }
}
