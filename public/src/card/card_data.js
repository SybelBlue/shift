function gfret(value) {
  return (...args) => value;
}

function gvset(valueCode, value) {
  return (...args) => game.values[valueCode] = value;
}

/**
-------- White Deck ---------- comp hardware
9 programs
 1 Keyboard & Mouse {timers: 2, basic: true}
 2 Antivirus Software {timers: 2, basic: true}
 3 Screen {timers: 2, basic: true}
 4 CPU Clock, turn start->fetch timer {timers:3}
 5 Registry, {timers:}
 6 Task Manager
 7
 8
 9
4 viruses
8 scripts
 1 Timely Draw, draw extra cards = timers {standard: true}
 2 Planned Obsolecence, timers=8 for one turn
13 ends
 1 Handy, win at 12 cards {timers: 5}
 2
 3
 4
 5
 6
 7
 8
15 commands (incl. draw, play)
 1 Play 2 {timers: 1, standard: true}
 2 Play 3 {timers: 3, standard: true}
 3 Play 4 {timers: 4}
 4 Draw 2 {timers: 0, standard: true}
 5 Draw 3 {timers: 2, standard: true}
 6 Draw 4 {timers: 3}
4 timers
---> 50 cards, timers [7, 9]

-------- Blue Deck ---------- cmd line
12 programs
15 scripts
 1 Timely Draw, draw extra cards = timers {standard: true}
 reorganize the rest of the cards
5 ends
13 commands (incl. draw, play)
 1 Play 2 {timers: 1, standard: true}
 2 Play 3 {timers: 3, standard: true}
 3 Play 4 {timers: 4}
 4 Draw 2 {timers: 0, standard: true}
 5 Draw 3 {timers: 2, standard: true}
 6 Draw 4 {timers: 3}
 7 Play All {timers: 5}
5 timers
---> 50 cards, timers [8, 10]

-------- Red Deck ---------- red team
10 programs
8 scripts
 1 Timely Draw, draw extra cards = timers {standard: true}
 2 Planned Obsolecence, timers=8 for one turn
14 ends
15 commands (incl. draw, play)
 1 Play 2 {timers: 1, standard: true}
 2 Play 3 {timers: 3, standard: true}
 3 Play 4 {timers: 4}
 4 Draw 2 {timers: 0, standard: true}
 5 Draw 3 {timers: 2, standard: true}
 6 Draw 4 {timers: 3}
3 timers
---> 50 cards, timers [6, 8]
 */

startingCards = []

cards = [
  {"id": "0", "desc": "", "ticks": "2", "name": "Keyboard & Mouse", "type": Types.program},
{"id": "1", "desc": "On play, remove virus", "ticks": "2", "name": "Antivirus.exe", "type": Types.program},
{"id": "2", "desc": "On turn, Fetch tick card", "ticks": 0, "name": "CPU Clock", "type": Types.program},
{"id": "3", "desc": "", "ticks": 0, "name": "Werd Editor", "type": Types.program},
{"id": "4", "desc": "Each turn, you must move a virus card from the discard to the deck and shuffle.", "ticks": 0, "name": "Browser", "type": Types.program},
{"id": "5", "desc": "", "ticks": "7", "name": "Registry", "type": Types.program},
{"id": "6", "desc": "On turn, steal program, virus if none", "ticks": "8", "name": "Task Manager", "type": Types.program},
{"id": "7", "desc": "While you have this card, your cards cannot be stolen or transferred.", "ticks": 0, "name": "Encryption", "type": Types.program},
{"id": "8", "desc": "On play, lose two cards. You may choose to add this to the hand of the player who's turn is next.", "ticks": 0, "name": "Bad Link!", "type": Types.virus},
{"id": "9", "desc": "Tick cards can't be played, can't win", "ticks": 0, "name": "Power Outage!", "type": Types.virus},
{"id": "10", "desc": "Discard hand, this card cannot be stolen or transferred.", "ticks": 0, "name": "Misplaced Juice!", "type": Types.virus},
{"id": "11", "desc": "Your hand limit is 4", "ticks": 0, "name": "Full Memory!", "type": Types.virus},
{"id": "12", "desc": "The next player draws from the top of the discard.", "ticks": 0, "name": "Data Mining", "type": Types.script},
{"id": "13", "desc": "Draw equal to timers played", "ticks": 0, "name": "Timely Draw", "type": Types.script},
{"id": "14", "desc": "Everyone discards down to 5 cards", "ticks": 0, "name": "Disk Cleanup", "type": Types.script},
{"id": "15", "desc": "Discard any command, program, or virus card", "ticks": 0, "name": "Quit", "type": Types.script},
{"id": "16", "desc": "Transfer two program or virus cards between players", "ticks": 0, "name": "Force Exit", "type": Types.script},
{"id": "17", "desc": "Move any two cards from player to player", "ticks": 0, "name": "Screen Sharing", "type": Types.script},
{"id": "18", "desc": "Gather all programs and viruses, shuffle, redistribute equally", "ticks": 0, "name": "Networking", "type": Types.script},
{"id": "19", "desc": "Discard all tick cards in play, draw and discard until tick card comes up ", "ticks": 0, "name": "December '69", "type": Types.script},
{"id": "20", "desc": "If you have 7 or more programs in play", "ticks": 0, "name": "Suite Deal", "type": Types.end},
{"id": "21", "desc": "If you have Registry and Task Manager", "ticks": 0, "name": "Advanced User", "type": Types.end},
{"id": "22", "desc": "If you start the turn with cards, play them all, and draw back up to 5", "ticks": 0, "name": "Off, Then On Again", "type": Types.end},
{"id": "23", "desc": "If you have two of Werd Editor, Browser, Full Memory!", "ticks": 0, "name": "A Millenial's Touch", "type": Types.end},
{"id": "24", "desc": "If you have Misplaced Juice! and Full Memory!", "ticks": 0, "name": "Glass Half Full", "type": Types.end},
{"id": "25", "desc": "If you have Bad Link! and one of Antivirus.exe or Browser", "ticks": 0, "name": "Befriend a Prince", "type": Types.end},
{"id": "26", "desc": "If you have Overclocked, GPU Accelerated, and any program", "ticks": 0, "name": "Faster, Hotter, Better", "type": Types.end},
{"id": "27", "desc": "If you have three viruses or more", "ticks": "7", "name": "Upgrade", "type": Types.end},
{"id": "28", "desc": "If you have three viruses or more and Antivirus.exe", "ticks": 0, "name": "Firewall", "type": Types.end},
{"id": "29", "desc": "If there are six commands in play and you add a seventh", "ticks": 0, "name": "A Regular Hacker", "type": Types.end},
{"id": "30", "desc": "Draw 4 cards per turn", "ticks": 0, "name": "App Store 4", "type": Types.draw},
{"id": "31", "desc": "Draw 3 cards per turn", "ticks": 0, "name": "App Store 3", "type": Types.draw},
{"id": "32", "desc": "Play 3 cards per turn", "ticks": 0, "name": "Multitasking 3", "type": Types.play},
{"id": "33", "desc": "Play 2 cards per turn", "ticks": 0, "name": "Multitasking 2", "type": Types.play},
{"id": "34", "desc": "All scripts and ends that are drawn must be played", "ticks": 0, "name": "Child's Play", "type": Types.command},
{"id": "35", "desc": "Discard two cards to draw from the top of the discard", "ticks": 0, "name": "Recycle Bin", "type": Types.command},
{"id": "36", "desc": "You may draw 4 cards, then give a card to each player from your hand", "ticks": 0, "name": "Bytes and Pieces", "type": Types.command},
{"id": "37", "desc": "All players' hand limit is 4.", "ticks": 0, "name": "Just a Nibble", "type": Types.command},
{"id": "38", "desc": "All players' are allowed up to 4 programs and viruses.", "ticks": 0, "name": "Stock Wares", "type": Types.command},
{"id": "39", "desc": "Discard two cards to move a virus from player to player", "ticks": 0, "name": "Quarantine", "type": Types.command},
{"id": "40", "desc": "Draw an additional card for each timer in play", "ticks": 0, "name": "Overclocked", "type": Types.command},
{"id": "41", "desc": "Draw an additional card for each program you have, discard an additional card for each virus you have.", "ticks": 0, "name": "GPU Accelerated", "type": Types.command},
{"id": "42", "desc": "You may let a player steal a random card from your hand to draw two cards", "ticks": 0, "name": "Ask Your Grandson", "type": Types.command},
{"id": "43", "desc": "Discard all active command, play, and draw cards, including this one.", "ticks": 0, "name": "Clear Command Line", "type": Types.command},
{"id": "44", "desc": "Play with hands open", "ticks": 0, "name": "Public Network", "type": Types.command},
{"id": "45", "desc": "", "ticks": "0", "name": "Tick!", "type": Types.tick},
{"id": "46", "desc": "", "ticks": "0", "name": "Tick!", "type": Types.tick},
{"id": "47", "desc": "", "ticks": "0", "name": "Tick!", "type": Types.tick}
]

ruleArray = [
  {
    id: 0
  },
  {
    id: 1,
    onPlay(callback) {
      game.selectedStack.selectNTyped(
        this.id,
        1,
        items => {items[0].discard(); callback();}
      )
    }
  },
  {
    id: 2,
    onPlay(callback) {
      game.deck.fetchAndPlay(c => c.type === Types.tick);
      callback();
    }
  },
  {
    id: 3
  },
  {
    id: 4,
    onPlay(callback) {
      game.events.turnStart.addWithId(this.id, (c, ...args) => {
        game.debug.log('adding discarded virus to deck', this.id);
        var card = game.discard.fetch(c => c.type === Types.virus);
        if (card) {
          game.deck.collect(card);
        }
        c();
      });
      callback();
    },
    onLose(callback) {
      game.events.turnStart.removeWithId(this.id);
      callback();
    }
  },
  {
    id: 5
  },
  {
    id: 6,
    onPlay(callback) {
      game.events.turnStart.addWithId(this.id, (c, ...args) => {
        // TODO: steal program, virus if none
        game.debug.log('stealing card')
        c();
      });
      callback();
    },
    onLose(callback) {
      game.events.turnStart.removeWithId(this.id);
      callback();
    }
  },
  {
    id: 7,
    onPlay(callback) {
      game.values[STEALABLE].push(this.id);
      game.values[TRANSFERABLE].push(this.id);
      callback();
    },
    onLose(callback) {
      game.values[STEALABLE].remove(this.id);
      game.values[TRANSFERABLE].remove(this.id);
      callback();
    }
  },
  {
    id: 8,
    onPlay(callback) {
      var card = game.hand.getRandom();
      if (card) {
        card.discard();
        card = game.hand.getRandom();
        if (card) {
          card.discard();
        }
      }

      callback();
    },
    optionalAction(callback) {
      // TODO: transer to next player in turn order
      game.debug.log('transfering card');
      callback();
    }
  },
  {
    id: 9,
    onPlay(callback) {
      game.values[WINABLE].push(this.id);
      callback();
    },
    onLose(callback) {
      game.values[WINABLE].remove(this.id);
      callback();
    }
  },
  {
    id: 10,
    onPlay(callback) {
      while (game.hand.cards.length) {
        game.hand.cards[0].discard();
      }
      callback();
    }
  },
  {
    id: 11,
    onPlay(callback) {
      game.values[HAND_LIMITS].push(4);
      callback();
    },
    onLose(callback) {
      game.values[HAND_LIMITS].remove(4);
      callback();
    }
  },
  {
    id: 12,
    onPlay(callback) {
      // TODO: force next person to draw
      game.debug.log('next person draws', this.id);
      callback();
    }
  },
  {
    id: 13,
    onPlay(callback) {
      for (var i = 0; i < game.values[TICKS_PLAYED]; i++) {
        game.deck.draw();
      }
      callback();
    }
  },
  {
    id: 14,
    onPlay(callback) {
      // TODO: everyone discards to five cards
      game.debug.log('everyone discards to 5', this.id);
      callback();
    }
  },
  {
    id: 15,
    onPlay(callback) {
      selectNTyped(this.id, 1,
        items => {
          if (items.length) {
            items[0].discard();
          }
          callback();
        },
        [Types.command, Types.program, Types.virus])
    }
  },
  {
    id: 16,
    onPlay(callback) {
      // TODO: transfer 2 prgrm/virus cards between any two players
      game.debug.log('transfer 2 program/virus cards', 16);
      callback();
    }
  },
  {
    id: 17,
    onPlay(callback) {
      // TODO: transfer 2 cards between any two players
      game.debug.log('transfer 2 cards', 17);
      callback();
    }
  },
  {
    id: 18,
    onPlay(callback) {
      // TODO: gather all prog/viruses and randomly redistribute
      game.debug.log('redistribute programs and viruses', 18);
      callback();
    }
  },
  {
    id: 19,
    onPlay(callback) {
      // TODO: discard all other tick cards
      game.debug.log('discarding all ticks', 18);
      game.desktop.cards.filter(c => c.type === Types.tick)
          .forEach(c => c.discard());
      var card = game.deck.draw();
      while (card && card.type !== Types.tick) {
        card.discard();
        card = game.deck.draw();
      }
      callback();
    }
  },
  {
    id: 20,
    onPlay(callback) {
      game.values[WIN_CONDITIONS].push({
        id: this.id,
        cond: () =>
          game.hand.cards.filter(c => c.type === Types.program).length > 6
      });
      callback();
    },
    onLose(callback) {
      game.values[WIN_CONDITIONS] =
        game.values[WIN_CONDITIONS].filter(o => o.id !== this.id);
      callback();
    }
  },
  {
    id: 21,
    onPlay(callback) {
      game.values[WIN_CONDITIONS].push({
        id: this.id,
        cond: () =>
          game.hand.cards.filter(c => c.type === Types.program).length > 6
      });
      callback();
    },
    onLose(callback) {
      game.values[WIN_CONDITIONS] =
        game.values[WIN_CONDITIONS].filter(o => o.id !== this.id);
      callback();
    }
  },
  {
    id: 22,
    onPlay(callback) {
      game.values[WIN_CONDITIONS].push({
        id: this.id,
        cond: () => game.values[CARD_COUNT_MIN] === 0 &&
              game.values[CARD_COUNT_START] > 0 && game.hand.cards.length >= 5
      });
      callback();
    },
    onLose(callback) {
      game.values[WIN_CONDITIONS] =
        game.values[WIN_CONDITIONS].filter(o => o.id !== this.id);
      callback();
    }
  },
  {
    id: 23,
    onPlay(callback) {
      game.values[WIN_CONDITIONS].push({
        id: this.id,
        cond: () =>
          game.desktop.cards.filter(c => [3, 4, 11].includes(c.id)).length > 1
      });
      callback();
    },
    onLose(callback) {
      game.values[WIN_CONDITIONS] =
        game.values[WIN_CONDITIONS].filter(o => o.id !== this.id);
      callback();
    }
  },
  {
    id: 24,
    onPlay(callback) {
      game.values[WIN_CONDITIONS].push({
        id: this.id,
        cond: () =>
          game.desktop.cards.filter(c => [10, 11].includes(c.id)).length > 1
      });
      callback();
    },
    onLose(callback) {
      game.values[WIN_CONDITIONS] =
        game.values[WIN_CONDITIONS].filter(o => o.id !== this.id);
      callback();
    }
  },
  {
    id: 25,
    onPlay(callback) {
      game.values[WIN_CONDITIONS].push({
        id: this.id,
        cond: () => game.desktop.cards.find(c => c.id === 8) &&
          game.desktop.cards.filter(c => [1, 4].includes(c.id)).length > 1
      });
      callback();
    },
    onLose(callback) {
      game.values[WIN_CONDITIONS] =
        game.values[WIN_CONDITIONS].filter(o => o.id !== this.id);
      callback();
    }
  },
  {
    id: 26,
    onPlay(callback) {
      game.values[WIN_CONDITIONS].push({
        id: this.id,
        cond: () => game.desktop.cards.find(c => c.id === 42) &&
          game.desktop.cards.filter(c => [41, 42].includes(c.id)).length > 1
      });
      callback();
    },
    onLose(callback) {
      game.values[WIN_CONDITIONS] =
        game.values[WIN_CONDITIONS].filter(o => o.id !== this.id);
      callback();
    }
  },
  {
    id: 27,
    onPlay(callback) {
      game.values[WIN_CONDITIONS].push({
        id: this.id,
        cond: () =>
          game.desktop.cards.filter(c => c.type === Types.virus).length >= 3
      });
      callback();
    },
    onLose(callback) {
      game.values[WIN_CONDITIONS] =
        game.values[WIN_CONDITIONS].filter(o => o.id !== this.id);
      callback();
    }
  },
  {
    id: 28,
    onPlay(callback) {
      game.values[WIN_CONDITIONS].push({
        id: this.id,
        cond: () => game.desktop.cards.find(c => c.id === 1) &&
          game.desktop.cards.filter(c => c.type === Types.virus).length >= 3
      });
      callback();
    },
    onLose(callback) {
      game.values[WIN_CONDITIONS] =
        game.values[WIN_CONDITIONS].filter(o => o.id !== this.id);
      callback();
    }
  },
  {
    id: 29,
    onPlay(callback) {
      game.values[WIN_CONDITIONS].push({
        id: this.id,
        cond: () => false // TODO: get global command count, on seventh play, win
      });
      callback();
    },
    onLose(callback) {
      game.values[WIN_CONDITIONS] =
        game.values[WIN_CONDITIONS].filter(o => o.id !== this.id);
      callback();
    }
  },
  {
    id: 30,
    onPlay(callback) {
      game.values[CARDS_TO_DRAW] = () => 4;
      callback();
    }
  },
  {
    id: 31,
    onPlay(callback) {
      game.values[CARDS_TO_DRAW] = () => 3;
      callback();
    }
  },
  {
    id: 32,
    onPlay(callback) {
      game.values[CARDS_TO_PLAY] = () => 3;
      callback();
    }
  },
  {
    id: 33,
    onPlay(callback) {
      game.values[CARDS_TO_PLAY] = () => 2;
      callback();
    }
  },
  {
    id: 34,
    onPlay(callback) {
      game.values[MUST_PLAYS].push(Types.script);
      game.values[MUST_PLAYS].push(Types.end);
      callback();
    },
    onLose(callback) {
      game.values[MUST_PLAYS].remove(Types.script);
      game.values[MUST_PLAYS].remove(Types.end);
      callback();
    }
  },
  {
    id: 35,
    onPlay(callback) {
      selectN(this.id, 1,
      items => {
        game.hand.collect(game.discard.cards.peek());
        items.forEach(c => c.discard());
        callback();
      },
      item => item.parent === game.hand,
      'select 2x --from hand'
      )
    }
  },
  {
    id: 36,
    optionalAction(callback) {
      for (var i = 0; i < 8; i++) {
        game.deck.draw();
      }

      // TODO: transfer 2 cards from hand to each other player
      callback();
    }
  },
  {
    id: 37,
    onPlay(callback) {
      // TODO: global hand limit is 4
      game.values[HAND_LIMITS].push(4);
      callback();
    },
    onLose(callback) {
      // TODO: global hand limit is 4
      game.values[HAND_LIMITS].remove(4);
      callback();
    }
  },
  {
    id: 38,
    onPlay(callback) {
      // TODO: global type limit is below
      game.values[TYPE_LIMITS].push({
        id: this.id,
        types: [Types.program, Types.virus],
        limit: 4
      });
      callback();
    },
    onLose(callback) {
      // TODO: global type limit is below
      game.values[TYPE_LIMITS] =
        game.values[TYPE_LIMITS].filter(o => o.id !== this.id);
      callback();
    }
  },
  {
    id: 38,
    onPlay(callback) {
      // TODO: global type limit is below
      game.values[TYPE_LIMITS].push({
        id: this.id,
        types: [Types.program, Types.virus],
        limit: 4
      });
      callback();
    },
    onLose(callback) {
      // TODO: global type limit is below
      game.values[TYPE_LIMITS] =
        game.values[TYPE_LIMITS].filter(o => o.id !== this.id);
      callback();
    }
  },
  {
    id: 39,
    optionalAction(callback) {
      // TODO: discard two cards to transfer virus from player to player
      callback();
    }
  },
  {
    id: 40,
    onPlay(callback) {
      game.events.turnStart.addWithId(this.id, (c, ...args) => {
        for (var i = 0; i < game.values[TICKS_PLAYED]; i++) {
          game.deck.draw();
        }
        c();
      });
      callback();
    },
    onLose(callback) {
      game.events.turnStart.removeWithId(this.id);
      callback();
    }
  },
  {
    id: 41,
    onPlay(callback) {
      game.events.turnStart.addWithId(this.id, (c, ...args) => {
        for (var i = 0; i < game.values[TICKS_PLAYED]; i++) {
          game.deck.draw();
        }
        c();
      });
      game.events.turnEnd.addwithId(this.id, (c, ...args) => {
        var n = game.desktop.filter(c => c.type === Types.virus).length;
        select(this.id,
          item => item.parent === game.hand,
          items => items.length >= n || items.length >= game.hand.cards.length,
          items => {
            items.forEach(i => i.discard());
            c();
          },
          'select ' + n + ' --from hand'
        );
      });
      callback();
    },
    onLose(callback) {
      game.events.turnStart.removeWithId(this.id);
      game.events.turnEnd.removeWithId(this.id);
      callback();
    }
  },
  {
    id: 42,
    optionalAction(callback) {
      var card = game.hand.getRandom();
      if (card) {
        // TODO: transfer card to a player of choice, don't exile
        game.exileField.collect(card);
        game.deck.draw();
        game.deck.draw();
      }
      callback();
    }
  },
  {
    id: 43,
    onPlay(callback) {
      // TODO: discard all other active command cards
      game.allCards.filter(c => c.parent !== game.deck &&
          [Types.command, Types.play, Types.draw].includes(c.type))
          .forEach(c => c.discard());
    }
  },
  {
    id: 44 // TODO: play with hands open
  },
  {
    id: 45
  },
  {
    id: 46
  },
  {
    id: 47
  }
]
