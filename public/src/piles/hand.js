class Hand extends PlayableField {
  constructor(player) {
    super(Hand.defaultPosition(), Hand.defaultDimensions());
    this.player = player;
    this.popUp = new HandPopupDisplay(this);
    this.highMode = false;
  }

  collect(card) {
    var fire = !this.cards.includes(card);
    super.collect(card);
    if (fire) {
      game.events.draw.fire(this.player, card);
    }
    card.interactable = true;
    card.visible = true;
    card.flipped = true;
    game.values[CARD_COUNT_MAX] = Math.max(
      game.values[CARD_COUNT_MAX], this.cards.length);
  }

  lose(card) {
    super.lose(card);
    game.values[CARD_COUNT_MIN] = Math.min(
      game.values[CARD_COUNT_MIN], this.cards.length);
  }

  display() {
    if (this.targetPosition) {
      this.position = this.nextLerpPosition_();
    }
    super.display(color(55, 55, 55, 150));
    if (this.highMode = (mouseY >= this.y)) {
      this.lerpTo(Hand.upperPosition(), 50);
    } else {
      this.lerpTo(Hand.defaultPosition(), 50);
    }

    this.popUp.display();
  }

  set requestDescription(value) {
    this.popUp.item = value;
  }

  refreshPosition() {
    return this.highMode? Hand.upperPosition(): Hand.defaultPosition();
  }

  static defaultPosition() {
    return createVector(10, height - HAND_HEIGHT/2 - 10);
  }

  static upperPosition() {
    return createVector(10, height - HAND_HEIGHT - 10);
  }

  static defaultDimensions() {
    return [width - 20, HAND_HEIGHT + 20]
  }
}
