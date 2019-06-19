const sum = (a, b) => a + b;
Array.prototype.peek = function() {
  return this.length? this[this.length - 1]: null;
}
Array.prototype.sum = function() {
  return this.reduce(sum, 0);
}
Array.prototype.remove = function(item) {
  return this.splice(this.indexOf(item), 1);
}

function getCardFromId(id) {
  return getCardFromProp('id', id);
}

function getCardFromName(name) {
  return getCardFromProp('name', name);
}

function getCardFromProp(propName, value) {
  return getCard(c => c[propName] === value);
}

function getCard(filter) {
  return game.allCards.find(filter);
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

function generateTwoLineBox(text, width, height, startingSize=40) {
  var fontSize = startingSize + 2;
  var stop = text.length / 2;
  var words = text.split(' ');
  var line1 = [words.shift()];
  var taken = line1[0].length;
  while (words.length && taken + words[0].length/2  + 1 < stop) {
    var word = words.shift();
    line1.push(word);
    taken += word.length;
  }

  line1 = line1.join(' ');
  var line2 = words.join(' ');

  var bbox, h;
  do {
    fontSize--;
    bbox = main_font.textBounds(line1, 0, 0, fontSize);
    if (bbox.w > width) {
      continue;
    }
    h = bbox.h;
    bbox = main_font.textBounds(line2, 0, 0, fontSize);
    h += bbox.h;
  } while (fontSize > 10 && (bbox.w > width || h > height));
  line1.stringify = () => this;
  line2.stringify = () => this;
  return {fontSize: fontSize, lines: [line1, line2]};
}

var takenNames = [];
function makeUsername(push=true) {
  function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length) % arr.length];
  }
  var adjs = ['ajax', 'automated', 'agile', 'block-chain', 'crowd-sourced',
  'machine', 'micro', 'nano', 'dynamic', 'cloud-based', 'decentralized',
  'networked', 'crowd-sourced', 'functional', 'algorithmic', 'client-side',
  'uncommented', 'refactored', 'lite', 'propreitary', 'end-to-end', 'buggy',
  'assembled', 'bit-shifted', 'binary', 'remote', 'big-data', 'innovative',
  'evolving', 'digital', 'virtual', 'front-end', 'back-end', 'lambda',
  'next-gen', '3D', '4D', 'updated', 'data-driven', 'home-edition', 'pro',
  'real-time', 'pioneering', 'planned', 'mammoth', 'viral', 'trending',
  'quantum', 'liquid-cooled', 'tensor-flow']
  var nouns = ['giraffe', 'pillow', 'penguin', 'poetry', 'serif',
  'bison', 'dolphin', 'eagle', 'code-monkey', 'shepherd', 'duck', 'bunny',
  'wolf', 'turkey', 'lion', 'piglet', 'snek', 'wrench', 'chicken', 'bolt',
  'tabby', 'corgi', 'hammer', 'pencil', 'dormouse', 'pelican', 'coffee',
  'mammoth', 'obsolescence', 'caracal', 'ocelot', 'bengal', 'tortoise',
  'rhino', 'kookaburra', 'puppy']
  var name = getRandom(adjs) + ' ' + getRandom(nouns);
  while (takenNames.includes(name)) {
    name = getRandom(adjs) + ' ' + getRandom(nouns);
  }

  if (push) {
    takenNames.push(name);
  }

  return name;
}
