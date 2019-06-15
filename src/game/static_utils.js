const sum = (a, b) => a + b;
Array.prototype.peek = function() {
  return this.length? this[this.length - 1]: null;
}
Array.prototype.sum = function() {
  return this.reduce(sum, 0);
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
