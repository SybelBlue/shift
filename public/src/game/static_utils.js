const sum = (a, b) => a + b;
Array.prototype.peek = function() {
  return this.length? this[this.length - 1]: null;
}
Array.prototype.sum = function() {
  return this.reduce(sum, 0);
}

function updateAvgFrameRate() {
  game.avgFrameRate =
    ((game.avgFrameRate || 0) * (frameCount - 1) + getFrameRate()) / frameCount;
}

function mouseClicked(e) {
  var clicked = checkClick();
  socket.emit('click', objectUnderCursor() && objectUnderCursor().name);
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

function makeNewTypedDiscard(type) {
  function getNewTypedDiscardPosition() {
    function sumPile(prop) {
      return game.typedDiscards.map(item => item[prop]).reduce((a, b) => a + b, 0);
    }
    return createVector(10 * (game.typedDiscards.length + 1) + sumPile('width'), 10);
  }
  var pos = getNewTypedDiscardPosition();
  if (type !== Types.end) {
    var item = new TypedDiscard(pos, type);
  } else {
    var item = new GoalDiscard(pos);
  }
  game.typedDiscards.push(item);
  return item;
}

class WordLine {
  constructor(maxWidth) {
    this.words = [];
    this.height = 0;
    this.width = 0;
    this.maxWidth = maxWidth;
  }

  addWord(word, width, height) {
    if (this.width + width > this.maxWidth) {
      return false;
    }
    this.words.push(word);
    this.height = Math.max(this.height, height);
    this.width += width;
    return true;
  }

  isEmpty() {
    return this.words.length == 0;
  }

  stringify() {
    return this.words.join(' ');
  }
}

class WordBody {
  constructor(maxHeight, btwnLine=0) {
    this.lines = [];
    this.maxHeight = height;
    this.margin = btwnLine;
  }

  push(wordLine) {
    if (this.getLinesHeight() + wordLine.height > this.maxHeight) {
      return false;
    }
    this.lines.push(wordLine);
    return true;
  }

  getLinesHeight() {
    return this.lines.map(line => line.height + this.margin).sum() - this.margin;
  }

  listify() {
    return this.lines.map(line => line.words.join(' '));
  }
}

function generateTextBox(text, width, height, btwnLine=0, startingSize=50, font=main_font) {
  var fontSize = startingSize + 2; //+ 2 deducted at start of loop
  const words = text.split(' ');

  var searching = true;
  let lines, line;
  var i;
  while (searching && fontSize > 2) {
    fontSize -= 2;
    line = new WordLine(width);
    lines = new WordBody(height, btwnLine);

    i = 0;
    while (i < words.length) {
      var word = words[i];
      var wordBox = font.textBounds(word, 0, 0, fontSize);

      var added = line.addWord(word, wordBox.w, wordBox.h);

      // word rejected
      if (!added) {
        // first word in line
        if (line.isEmpty()) {
          break;
        }
        // not the first word
        added = lines.push(line);
        // too tall
        if (!added) {
          break;
        }
        // not too tall, just too wide for now
        line = new WordLine(width);
        // retry word
        i--;
      }

      i++;
    }

    searching = i < words.length || !lines.push(line);
  }

  return  {lines: lines, fontSize: fontSize};
}

// works best with monospace fonts
function generateTwoLineBox(text, width, height, btwnLine=0, startingSize=30, font=main_font) {
  var fontSize = startingSize + 2;
  while (fontSize > 2) {
    fontSize -= 2;
    var width = text.length / 2;
    var body = new WordBody(height, btwnLine);
    var line1 = new WordLine(width);
    var line2 = new WordLine(width);
    const words = text.split(' ');
    var cont = true;
    while (words.length && cont) {
      var word = words.pop();
      var wordBox = font.textBounds(word, 0, 0, fontSize);
      cont = line1.addWord(word, wordBox.w, wordBox.h);
    }
    cont = true;
    while (words.length) {
      var word = words.pop();
      var wordBox = font.textBounds(word, 0, 0, fontSize);
      if (line1.addWord(word, wordBox.w, wordBox.h)) {
        cont = false;
        break;
      }
    }
    if (cont && body.push(line1) && body.push(line2)) {
      return {lines: body, fontSize: fontSize};
    }
  }

  throw new Error('Too small');
}
