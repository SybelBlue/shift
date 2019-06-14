function objectUnderCursor() {
  if (game.deck.testInteract()) {
    return game.deck;
  }
  if (game.discard.testInteract()) {
    return game.discard;
  }

  for (var card of game.allCards.reverse()) {
    if (card.testInteract()) {
      return card;
    }
  }

  if (game.hand.testInteract()) {
    return game.hand;
  }

  for (var pile of game.typedDiscards) {
    if (pile.testInteract()) {
      return pile;
    }
  }

  if (game.permaZone.testInteract()) {
    return game.permaZone;
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
  return new Card(json.name, json.ruleset, json.type);
}

function constructCardArrayFromJSONs(json_arr) {
  return json_arr.map(constructCardFromJSON);
}
