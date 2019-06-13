class TypedDiscard extends Discard {
  constructor(position, type, limit=1) {
    super(position)
    this.type = type;
    this.limit = 1;
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
  }

  discardable(card) {
    return card && card.type === this.type;
  }
}

class GoalDiscard extends TypedDiscard {
  constructor(position, limit=1) {
    super(position, Types.end, limit);
  }
}
