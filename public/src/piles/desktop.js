class Desktop extends PlayableField {
  constructor() {
    super(Desktop.defaultPosition(), Desktop.defaultDimensions());
    this.usedRegions = [];
    this.fontSize = 30;
    this.actionStrings = [];
    this.pushActionString(game.mainPlayer, 'join');
  }

  display() {
    this.displayText();

    super.display(color(200, 200, 200, 20));
  }

  displayText() {
    fill(55);
    noStroke();
    textAlign(LEFT, TOP);
    var userString = 'shift\\' + game.mainPlayer.username + '> ';
    if (game.turnManager.isMainTurn()) {
      userString += (Date.now() % 1000 < 500)? '_': '';
    } else {
      userString += 'waiting for ' + game.turnManager.currentPlayer.username;
      userString += '... ['
      switch (Math.floor((Date.now() % 2000) / 500)) {
        case 0:
          userString += '|';
          break;
        case 1:
          userString += '/';
          break;
        case 2:
          userString += '-';
          break;
        case 3:
          userString += '\\';
          break;
      }
      userString += ']'
    }

    var bbox;
    while ((bbox = main_font.textBounds(userString, 0, 0, this.fontSize)).w
        > 0.75 * this.width) {
      this.fontSize--;
    }

    this.startingH = !this.startingH || abs(this.startingH - bbox.h) > 15?
        bbox.h: this.startingH;
    textSize(this.fontSize);

    text(userString, this.x + 10, this.y + 10);

    var currentH = 10 + this.startingH + 5;
    for (var str of this.actionStrings.slice(0).reverse()) {
      bbox = main_font.textBounds(str, 0, 0, this.fontSize);
      if (currentH + bbox.h > this.height - 10) {
        break;
      }
      text(str, this.x + 10, this.y + currentH);
      currentH += bbox.h + 5;
    }
  }

  pushActionUpdate(s) {
    this.actionStrings.push(s);
  }

  pushActionString(player, action) {
    this.actionStrings.push('shift\\' + player.username + '> ' + action);
  }

  pushPlayString(player, card) {
    this.pushActionString(player, (card.type != Types.command? 'run ': '') +
        card.name);
  }

  collect(card, announce=true) {
    var contains = this.cards.includes(card);
    super.collect(card);
    var loc;
    if (!contains && !this.testHit()) {
      loc = this.randomLocation();
      if (announce) {
        game.events.play.fire(game.mainPlayer, card, this);
      }
    } else {
      var upperX = this.x + this.width - 10 - CARD_WIDTH/2;
      var lowerX = this.x + 10 + CARD_WIDTH/2;
      var upperY = this.y + this.height - 10 - CARD_HEIGHT/2;
      var lowerY = this.y + 10 + CARD_HEIGHT/2;
      var x = Math.max(lowerX, Math.min(mouseX, upperX));
      var y = Math.max(lowerY, Math.min(mouseY, upperY));
      rect(lowerX, lowerY, upperX-lowerX, upperY-lowerY);
      loc = createVector(x - CARD_WIDTH/2, y - CARD_HEIGHT/2);
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
    var area = new Transformable(location, [1.75*CARD_WIDTH, 1.75*CARD_HEIGHT]);
    this.usedRegions.push(area);
  }

  static defaultPosition() {
    return createVector(10, Deck.defaultPosition().y + DECK_HEIGHT + 10);
  }

  static defaultDimensions() {
    return [width - 20, height - (HAND_HEIGHT + 20 + DECK_HEIGHT/2 + 20)];
  }
}
