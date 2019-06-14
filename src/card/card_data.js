const Types = Object.freeze({
  play: {
      name: 'play',
      color: [250, 100, 50]
    },
  draw: {
      name: 'draw',
      color: [50, 50, 250]
    },
  end: {
      name: 'end',
      color: [100, 250, 50]
    },
  time: {
      name: 'time',
      color: [117, 221, 221]
    },
  instant: {
      name: 'instant',
      color: [150, 50, 250]
    }
});

function gfret(value) {
  return (...args) => value;
}

function gvset(valueCode, value) {
  return (...args) => game.values[valueCode] = value;
}

// TODO: mooooooore

startingCards = [
]

cards = [
  {
    name: 'Time!',
    type: Types.time,
    ruleset: null
  },
  {
    name: 'Time!',
    type: Types.time,
    ruleset: null
  },
  {
    name: 'Time!',
    type: Types.time,
    ruleset: null
  },
  {
    name: 'Play All',
    type: Types.play,
    ruleset: null
  },
  {
    name: 'Draw From Discard',
    type: Types.draw,
    ruleset: null
  },
  {
    name: 'Play 2',
    type: Types.play,
    ruleset: null
  },
  {
    name: 'Draw 2',
    type: Types.draw,
    ruleset: null
  },
  {
    name: 'Handy',
    type: Types.end,
    desc: 'You win if you have 10 cards in hand.',
    ruleset: null
  },
  {
    name: 'Draw Again',
    type: Types.instant,
    desc: "Draw another card, regardless of how many you've played.",
    ruleset: null
  }
]
