function updateAvgFrameRate() {
  game.avgFrameRate =
    ((game.avgFrameRate || 0) * (frameCount - 1) + getFrameRate()) / frameCount;
}

function mouseClicked(e) {
  var clicked = checkClick();
}

function checkHover() {
  var object = objectUnderCursor();

  if (object != game.lastHovered && game.lastHovered) {
    game.lastHovered.hover = false;
  }

  if (object instanceof Card) {
    object.hover = true;
    game.lastHovered = object;
  }
}

function objectUnderCursor() {
  if (game.lastHovered && game.lastHovered.testHit()) {
    return game.lastHovered;
  }

  if (game.deck.testHit()) {
    return game.deck;
  }
  if (game.discard.testHit()) {
    return game.discard;
  }

  for (var card of game.allCards.reverse()) {
    if (card.testHit()) {
      return card;
    }
  }

  if (game.hand.testHit()) {
    return game.hand;
  }

  for (var pile of game.typedDiscards) {
    if (pile.testHit()) {
      return pile;
    }
  }

  if (game.desktop.testHit()) {
    return game.desktop;
  }

  return null;
}

function checkClick() {
  var next = objectUnderCursor();
  if (next && next.interactable) {
    if (game.selectedStack.includes(next)) {
      game.selectedStack.remove(next);
    } else {
      game.selectedStack.push(next);
      next.select();
    }
    return true;
  }
  return false;
}

function constructCardFromJSON(json) {
  var card = new Card(json.name, json.ruleset, json.type, json.desc.trim());
  card.json_rep = json;
  return card;
}

function constructCardArrayFromJSONs(json_arr) {
  return json_arr.map(constructCardFromJSON);
}
