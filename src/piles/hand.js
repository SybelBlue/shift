class Hand extends PlayableField {
  constructor(player) {
    super(Hand.defaultPosition(), Hand.defaultDimensions());
    this.player = player;
    this.popUp = new HandPopupDisplay(this);
  }

  collect(card) {
    super.collect(card);
    game.events.draw.fire(card);
  }

  display() {
    if (this.targetPosition) {
      this.position = this.nextLerpPosition_();
    }
    super.display(color(55, 55, 55, 150));
    if (mouseY >= this.y) {
      this.lerpTo(Hand.upperPosition(), 50);
    } else {
      this.lerpTo(Hand.defaultPosition(), 50);
    }

    this.popUp.display();
  }

  set requestDescription(value) {
    this.popUp.item = value;
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

class HandPopupDisplay extends Transformable {
  constructor(hand) {
    super(HandPopupDisplay.defaultPosition(),
        HandPopupDisplay.defaultDimensions());
    this.parent = hand;
  }

  display() {
    if (!this.text_) {
      return;
    }

    this.makeBody(color(80));

    fill(230);
    stroke(55);
    textAlign(CENTER);
    textSize(this.fontSize * 5 / 6);
    var currentY = this.y + this.height/2;
    for (var line of this.text_.lines) {
      text(line.stringify(), this.x + this.width/2, currentY);
      currentY += line.height + 2;
    }

    fill(80);
    var card = this.item_;
    triangle(card.x + card.width/2, card.y - 10,
        card.x + card.width/2 - 20, card.y - 30,
        card.x + card.width/2 + 20, card.y - 30);
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
    var result = generateTextBox(value,
      this.width * 0.8, this.height - 10, 2, 30);
    this.text_ = result.lines;
    this.fontSize = result.fontSize;
  }

  static defaultPosition() {
    var handPos = Hand.defaultPosition();
    handPos.y -= 10 + HandPopupDisplay.defaultDimensions()[1];
    return handPos;
  }

  static defaultDimensions() {
    return [width - 20, HAND_HEIGHT * 3 / 8];
  }
}
