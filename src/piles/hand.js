class Hand extends PlayableField {
  constructor(player) {
    super(Hand.defaultPosition(), Hand.defaultDimensions());
    this.player = player;
  }

  collect(card) {
    super.collect(card);
    game.events.draw.fire(card);
  }

  static defaultPosition() {
    return createVector(10, height - HAND_HEIGHT - 10);
  }

  static defaultDimensions() {
    return [width - 20, HAND_HEIGHT]
  }
}
