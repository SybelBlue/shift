class Deck extends PlayableField {
  constructor(card_arr=cards) {
    super(createVector(width - DECK_WIDTH - 10, 10));
    constructCardArrayFromJSONs(card_arr).forEach(c => this.collect(c));
    this.rearrange();
  }

  collect(card) {
    super.collect(card);
    card.interactable = true;
    card.flipped = false;
  }

  rearrange() {
    var loc = createVector(this.x + (DECK_WIDTH - CARD_WIDTH) / 2,
        this.y + (DECK_HEIGHT - CARD_HEIGHT) / 2);
    var vis = true;
    this.cards.forEach(card => {
      card.lerpTo(loc);
      card.visible = vis || card.animStart;
      vis = false;
    });
  }

  select() {
    if (!this.cards.length) {
      if (game.discard.cards.length) {
        while (game.discard.cards.length) {
          this.collect(game.discard.cards.peek());
        }
      } else {
        console.log('mooooooore');
        return;
      }
    }
    game.selectedStack.pop();  // self
    var card = this.drawRandom();
    game.hand.collect(card);
  }

  drawRandom() {
    var index = Math.floor(random() * this.cards.length) % this.cards.length;
    var card = this.cards[index];
    card.flipped = true;
    card.visible = true;
    game.debug.log('draw', card);
    return card;
  }

  static defaultPosition() {
    return createVector(width - DECK_WIDTH - 10, 10);
  }
}
