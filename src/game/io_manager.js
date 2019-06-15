function objectUnderCursor() {
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
      game.selectedStack.splice(next);
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
