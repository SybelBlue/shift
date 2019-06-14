class Desktop extends PlayableField {
  constructor() {
    super(Desktop.defaultPosition(), Desktop.defaultDimensions());
    this.usedRegions = [];
  }

  display() {
    super.display(color(0, 0, 0, 0));
  }

  collect(card) {
    var contains = this.cards.includes(card);
    super.collect(card);
    if (!contains && !this.testHit()) {
      var loc = this.randomLocation();
      game.events.play.fire(card, this);
    } else {
      var upperX = this.x + this.width - 10 - CARD_WIDTH/2;
      var lowerX = this.x + 10 + CARD_WIDTH/2;
      var upperY = this.y + this.height - 10 - CARD_HEIGHT/2;
      var lowerY = this.y + 10 + CARD_HEIGHT/2;
      var x = Math.max(lowerX, Math.min(mouseX, upperX));
      var y = Math.max(lowerY, Math.min(mouseY, upperY));
      rect(lowerX, lowerY, upperX-lowerX, upperY-lowerY);
      var loc = createVector(x - CARD_WIDTH/2, y - CARD_HEIGHT/2);
      this.usedRegions = [];
      this.cards.filter(c => c != card).map(c => c.position)
          .forEach(p => this.markUsed(p.x, p.y));
    }
    this.markUsed(loc);
    card.lerpTo(loc);
  }

  rearrange() { return; }

  randomLocation() {
    var attempts = 0;
    var out;
    do {
      out = createVector(this.x + random(10, this.width - CARD_WIDTH - 10),
          this.y + random(10, this.height - CARD_HEIGHT - 10));
      attempts++;
    } while (attempts < 40 && this.inUsedRegion(out.x, out.y));
    if (attempts >= 40) {
      game.debug.log('cleared used regions', this.usedRegions);
      this.usedRegions = [];
    }
    return out;
  }

  inUsedRegion(x, y) {
    return this.usedRegions.find(r => r.testHit(x, y)) != null;
  }

  markUsed(pos) {
    var location = createVector(pos.x, pos.y);
    location.x -= CARD_WIDTH;
    location.y -= CARD_HEIGHT;
    var region = new Transformable(location, [1.75*CARD_WIDTH, 1.75*CARD_HEIGHT]);
    this.usedRegions.push(region);
  }

  static defaultPosition() {
    return createVector(10, Deck.defaultPosition().y + DECK_HEIGHT + 10);
  }

  static defaultDimensions() {
    return [width - 20, height - (HAND_HEIGHT + 20 + DECK_HEIGHT + 20)];
  }
}
