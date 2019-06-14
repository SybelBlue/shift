class Card extends Clickable {
  constructor(name, ruleset, type) {
    super(new p5.Vector(10, 10, 0), [CARD_WIDTH, CARD_HEIGHT]);
    this.flipped = false;
    this.scale = 1;
    this.cornerRoundPx = CORNER_ROUNDING;

    this.type = type;
    this.name = name;

    game.allCards.push(this);
  }

  display() {
    if (this.targetPosition) {
      this.position = this.nextLerpPosition_();
    }

    if (game.selectedStack.includes(this)) {
      strokeWeight(10);
      stroke(200,200,100,100);
    } else {
      strokeWeight(4);
      stroke(0);
    }

    if (this.flipped) {
      this.paintFront();
    } else {
      this.paintBack();
    }
  }

  paintFront() {
    var position = this.position;
    fill(255);
    this.makeBody();
    fill(color(...this.type.color));
    rect(position.x, position.y,
         COLOR_BAND_WIDTH * this.scale, this.height * this.scale,
         this.cornerRoundPx[0], 0, 0, this.cornerRoundPx[3]);

    noStroke();
    textSize(20);
    var name = {
      x: position.x + COLOR_BAND_WIDTH + 5,
      y: position.y + 5,
      height: 30,
      width: (this.width - COLOR_BAND_WIDTH - 10)
    }
    text(this.name, name.x, name.y,
      name.width * this.scale, name.height * this.scale);

    if (this.type === Types.tick) {
      image(hourglass_icon, name.x, name.y + name.height + 5,
          name.width * this.scale, (this.height - name.height - 10) * this.scale,
          130, 30, 512 - 2 * 130, 512 - 2 * 30);
    }
  }

  paintBack() {
    fill(35, 57, 91);
    this.makeBody();
  }

  discard(fire=true) {
    game.discard.collect(this, true, fire);
  }

  canDiscard() {
    return Types.tick !== this.type && Types.script !== this.type;
  }

  isPerma() {
    return false;
  }

  makeBody(position=this.position) {
    rect(position.x, position.y,
         ...this.dimension.map(n => n * this.scale),
         ...this.cornerRoundPx.map(n => n * this.scale));
  }
}
