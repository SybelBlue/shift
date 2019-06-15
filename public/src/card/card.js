class Card extends Clickable {
  constructor(name, ruleset, type, desc='') {
    super(new p5.Vector(10, 10, 0), [CARD_WIDTH, CARD_HEIGHT]);
    this.flipped = false;
    this.scale = 1;
    this.cornerRoundPx = CORNER_ROUNDING;

    this.type = type;
    this.name = name;
    this.desc = type.desc + ' ' + desc;
    this.jiggle = {t: 150, s: 1.5, x: 10};

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
    var position = this.position.copy();

    if (this.jiggle.start != null) {
      var xDisp = this.jiggle.x * Math.sin(
        TAU * this.jiggle.s * (Date.now() - this.jiggle.start) / this.jiggle.t
      );
      position.x += xDisp;
      if (Date.now() - this.jiggle.start > this.jiggle.t) {
        this.jiggle.start = null;
      }
    }

    fill(255);
    this.makeBody();
    fill(color(...this.type.color));
    rect(position.x, position.y,
         COLOR_BAND_WIDTH * this.scale, this.height * this.scale,
         this.cornerRoundPx[0], 0, 0, this.cornerRoundPx[3]);

    noStroke();
    textSize(this.fontSize);
    textAlign(LEFT)
    var name = {
      x: position.x + COLOR_BAND_WIDTH + 10,
      y: position.y + 5 + this.name_.lines[0].height,
    };

    this.makeName(name);

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

  shake() {
    this.jiggle.start = Date.now();
    game.debug.log('shaking', this.jiggle);
  }

  canDiscard() {
    return Types.tick !== this.type && Types.virus !== this.type;
  }

  makeBody(position=this.position) {
    rect(position.x, position.y,
         ...this.dimension.map(n => n * this.scale),
         ...this.cornerRoundPx.map(n => n * this.scale));
  }

  makeName(data) {
    var currentY = data.y;
    for (var line of this.name_.lines) {
      text(line.stringify(), data.x, currentY);
      currentY += line.height + 2;
    }
  }

  set name(value) {
    var result = generateTextBox(value,
      this.width - COLOR_BAND_WIDTH - 20, this.height / 3, 2);
    this.name_ = result.lines;
    this.fontSize = result.fontSize;
  }

  get name() {
    return this.name_.listify().join(' ');
  }

  set hover(value) {
    this.hover_ = value;
    if (this.desc) {
      game.hand.requestDescription = value? this: null;
    }
  }
}
