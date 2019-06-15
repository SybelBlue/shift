class PlayableField extends Clickable {
  constructor(position, dimension=[DECK_WIDTH, DECK_HEIGHT]) {
    super(position, dimension);
    this.cards = [];
  }

  display(c=color(55, 55, 55, 55)) {
    this.makeBody(c);
    this.cards.filter(card => card.visible).forEach(card => card.display());
  }

  makeBody(c) {
    fill(c)
    stroke(55);
    strokeWeight(4);
    rect(this.position.x, this.position.y, ...this.dimension, ...CORNER_ROUNDING);
  }

  collect(card) {
    if (card.parent) {
      card.parent.lose(card);
    }
    this.cards.push(card);
    this.clean();
    this.rearrange();
    card.parent = this;
  }

  lose(card) {
    // Doesn't work with object slice for some reason
    game.debug.log('lose', this);
    this.cards.splice(this.cards.indexOf(card), 1);
    this.rearrange();
  }

  rearrange() {
    var y = this.y + (this.height - CARD_HEIGHT) / 2;

    if (this.cards.length <= 1) {
      if (this.cards.length) {
        var x = this.x + (this.width - CARD_WIDTH) / 2;
        this.cards[0].lerpTo(createVector(x, y))
      }
      return;
    }

    if (this.cards.length * CARD_WIDTH + 20 >= this.width) {
      var xStep = (this.width - 20 - CARD_WIDTH) / (this.cards.length - 1);
    } else {
      var xStep = (this.width - 20) / this.cards.length;
    }

    var x = this.x + 10 + Math.max(xStep / 2 - CARD_WIDTH / 2, 0);
    for (var card of this.cards) {
      card.lerpTo(createVector(x, y));
      x += xStep;
    }
  }

  select() {
    game.selectedStack.pop();  // self
    if (!game.selectedStack.length) {
      return;
    }
    if (game.selectedStack.peek() instanceof PlayableField) {
      return;
    }
    var card = game.selectedStack.pop();
    this.collect(card);
    game.debug.log('select', this);
  }

  clean() {
    var newList = [];
    for (var card of this.cards.reverse()) {
      if (!newList.includes(card)) {
        newList.push(card);
      }
    }
    this.cards = newList.reverse();

  }
}
