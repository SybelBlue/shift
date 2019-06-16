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
    game.selectedStack.pop();  // self
    this.draw();
  }

  draw(destPlayer=null) { // for later use
    if (!this.cards.length) {
      this.refresh();
    }
    var card = this.getRandom();
    game.hand.collect(card); // fix here
  }

  refresh() {
    if (game.discard.cards.length) {
      while (game.discard.cards.length) {
        this.collect(game.discard.cards.peek());
      }
      return;
    }

    game.debug.log('mooooooore');
  }

  remove(name) {
    var n = this.cards.length;
    var card = this.cards.find(c => c.name === name);
    game.exileField.collect(card);
    game.debug.log('cards removed: ', n - this.cards.length);
  }

  getRandom() {
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
