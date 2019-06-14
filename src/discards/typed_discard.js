class TypedDiscard extends Discard {
  constructor(position, type, defaultValue=1, limit=1) {
    super(position)
    this.type = type;
    this.limit = 1;
    this.defaultValue = defaultValue;
  }

  collect(card, flipped=true) {
    super.collect(card, flipped);
    while (this.cards.length > this.limit) {
      this.cards[0].discard(false);
    }
    this.cards.forEach(c => c.visible = false);
    this.cards.peek().visible = true;
  }

  display() {
    super.display(this.type.color);
    if (!this.cards.length && this.defaultValue) {
      noStroke();
      fill(255);
      ellipse(this.x + this.width/2, this.y + this.height/2,
         this.width/2, this.width/2);
      fill(this.type.color);
      var label = '' + this.defaultValue;
      var x = this.x + this.width/2;
      var y = this.y + this.height/2;
      var size = 50;
      textSize(size);
      var bbox = main_font.textBounds(label, x, y, size);
      text(label, x - bbox.w/2, y - bbox.h/2, bbox.w, bbox.h);
    }
  }

  discardable(card) {
    return card && card.type === this.type;
  }
}
