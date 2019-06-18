class TypedDiscard extends Discard {
  constructor(position, type, defaultValue=1, limit=1) {
    super(position)
    this.type = type;
    this.limit = 1;
    this.defaultValue = defaultValue;
  }

  collect(card, flipped=true, fire=true) {
    super.collect(card, flipped, fire);
    while (this.cards.length > this.limit) {
      this.cards[0].discard(false);
    }
    this.cards.forEach(c => c.visible = false);
    this.cards.peek().visible = true;
  }

  display() {
    super.display(this.type.color);
    if (this.defaultValue && !this.cards.length) {
      noStroke();
      fill(255);
      ellipse(this.x + this.width/2, this.y + this.height/2,
         this.width/2, this.width/2);
      fill(this.type.color);
      var x = this.x + this.width/2;
      var y = this.y + this.height/2;
      var size = 60;
      textSize(size);
      textAlign(CENTER, LEFT);
      var bbox = main_font.textBounds('1', x, y, size);
      text('1', x, y + bbox.h/2);
    }
  }

  discardable(card) {
    return card && card.type === this.type;
  }
}
