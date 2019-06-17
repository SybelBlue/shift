module.exports = class Game {
  static generateUsername(push=true) {
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

    if (!Game.takeNames) {
      Game.takenNames = [];
    }

    var name = getRandom(adjs) + ' ' + getRandom(nouns);
    while (Game.takenNames.includes(name)) {
      name = getRandom(adjs) + ' ' + getRandom(nouns);
    }

    if (push) {
      Game.takenNames.push(name);
    }

    return name;
  }
}
