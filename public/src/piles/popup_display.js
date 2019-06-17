class HandPopupDisplay extends Transformable {
  constructor(hand) {
    super(HandPopupDisplay.defaultPosition(),
        HandPopupDisplay.defaultDimensions());
    this.parent = hand;
    this.triangleBob =  {t: 1.5, y: 5};
  }

  display() {
    if (!this.text_) {
      return;
    }

    this.makeBody(color(80));

    fill(230);
    stroke(55);
    textAlign(CENTER);
    textSize(this.fontSize);
    var currentY = this.y + this.height/2;
    for (var line of this.text_) {
      text(line, this.x + this.width/2, currentY);
      currentY += main_font.textBounds(line, this.x, currentY, this.fontSize).h;
    }

    fill(80);
    var card = this.item_;
    var yDisp =
        Math.sin(TAU * frameCount / game.avgFrameRate / this.triangleBob.t)
        * this.triangleBob.y;
    triangle(card.x + card.width/2, card.y - 10 + yDisp,
        card.x + card.width/2 - 20, card.y - 30 + yDisp,
        card.x + card.width/2 + 20, card.y - 30 + yDisp);
  }

  makeBody(c) {
    fill(c)
    stroke(55);
    strokeWeight(4);
    rect(this.position.x, this.position.y, ...this.dimension, ...CORNER_ROUNDING);
  }

  set item(value) {
    this.item_ = value;
    this.text = value? value.desc: null;
  }

  set text(value) {
    if (!value) {
      this.text_ = null;
      return;
    }
    var result = generateTwoLineBox(value, this.width, this.height, 30);
    this.text_ = result.lines;
    this.fontSize = result.fontSize;
  }

  get text() {
    return this.text_.listify().join(' ');
  }

  static defaultPosition() {
    var handPos = game.hand? game.hand.refreshPosition(): Hand.defaultPosition();
    handPos.y -= 10 + HandPopupDisplay.defaultDimensions()[1];
    return handPos;
  }

  static defaultDimensions() {
    return [width - 20, HAND_HEIGHT * 3 / 8];
  }
}
