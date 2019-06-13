class PermaZone extends PlayableField {
  constructor() {
    super(PermaZone.defaultPosition(), PermaZone.defaultDimensions());
  }

  display() {
    super.display(color(0, 0, 0, 0));
  }

  collect(card) {
    super.collect(card);
    card.lerpTo(this.randomLocation());
    game.events.play.fire(card, this);
  }

  rearrange() { return; }

  randomLocation() {
    return createVector(this.x + random(10, this.width - CARD_WIDTH - 10),
        this.y + random(10, this.height - CARD_HEIGHT - 10));
  }

  static defaultPosition() {
    return createVector(10, Deck.defaultPosition().y + DECK_HEIGHT + 10);
  }

  static defaultDimensions() {
    return [width - 20, height - (HAND_HEIGHT + 20 + DECK_HEIGHT + 20)];
  }
}
