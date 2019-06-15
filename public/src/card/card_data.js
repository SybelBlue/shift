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
  {"desc": "", "ticks": "2", "name": "Keyboard & Mouse", "type": Types.program},
  {"desc": "On play, remove virus", "ticks": "2", "name": "Antivirus.exe", "type": Types.program},
  {"desc": "On turn, Fetch tick card", "ticks": 0, "name": "CPU Clock", "type": Types.program},
  {"desc": "", "ticks": 0, "name": "Werd Editor", "type": Types.program},
  {"desc": "Each turn, you must move a virus card from the discard to the deck and shuffle.", "ticks": 0, "name": "Browser", "type": Types.program},
  {"desc": "", "ticks": "7", "name": "Registry", "type": Types.program},
  {"desc": "On turn, steal program, virus if none", "ticks": "8", "name": "Task Manager", "type": Types.program},
  {"desc": "While you have this card, your cards cannot be stolen or transferred.", "ticks": 0, "name": "Encryption", "type": Types.program},
  {"desc": "On play, lose two cards. You may choose to add this ", "ticks": 0, "name": "Bad Link!", "type": Types.virus},
  {"desc": "Tick cards can't be played, can't win", "ticks": 0, "name": "Power Outage!", "type": Types.virus},
  {"desc": "Discard hand, this card cannot be stolen or transferred.", "ticks": 0, "name": "Misplaced Juice!", "type": Types.virus},
  {"desc": "Your hand limit is 4", "ticks": 0, "name": "Full Memory!", "type": Types.virus},
  {"desc": "The next player draws from the top of the discard.", "ticks": 0, "name": "Data Mining", "type": Types.script},
  {"desc": "Draw equal to timers played", "ticks": 0, "name": "Timely Draw", "type": Types.script},
  {"desc": "Everyone discards down to 5 cards", "ticks": 0, "name": "Disk Cleanup", "type": Types.script},
  {"desc": "Discard any command, program, or virus card", "ticks": 0, "name": "Quit", "type": Types.script},
  {"desc": "You may move up to two program or virus cards between players", "ticks": 0, "name": "Force Exit", "type": Types.script},
  {"desc": "Move any two cards from player to player", "ticks": 0, "name": "Screen Sharing", "type": Types.script},
  {"desc": "Gather all programs and virus, shuffle, redistribute equally", "ticks": 0, "name": "Networking", "type": Types.script},
  {"desc": "Discard all tick cards in play, draw and discard until tick card comes up ", "ticks": 0, "name": "December '69", "type": Types.script},
  {"desc": "if you have 7 or more programs in play", "ticks": 0, "name": "Suite Deal", "type": Types.end},
  {"desc": "if you have Registry and Task Manager", "ticks": 0, "name": "Advanced User", "type": Types.end},
  {"desc": "if you loose all cards in your hand then draw again", "ticks": 0, "name": "Off, Then On", "type": Types.end},
  {"desc": "if you have two of Werd Editor, Browser, Full Memory!", "ticks": 0, "name": "A Millenial's Touch", "type": Types.end},
  {"desc": "if you have Misplaced Juice! and Full Memory!", "ticks": 0, "name": "Glass Half Full", "type": Types.end},
  {"desc": "if you have Bad Link! and Antivirus.exe or Browser", "ticks": 0, "name": "Befriend a Prince", "type": Types.end},
  {"desc": "if you have Overclocked, any program and GPU Accelerated is in play", "ticks": 0, "name": "Faster, Hotter, Better", "type": Types.end},
  {"desc": "if you have three viruses or more", "ticks": "7", "name": "Upgrade", "type": Types.end},
  {"desc": "if you have three viruses or more and Antivirus.exe", "ticks": 0, "name": "Firewall", "type": Types.end},
  {"desc": "if there are six commands in play and you add a seventh", "ticks": 0, "name": "A Regular Hacker", "type": Types.end},
  {"desc": "Draw 4 cards per turn", "ticks": 0, "name": "App Store 4", "type": Types.draw},
  {"desc": "Draw 3 cards per turn", "ticks": 0, "name": "App Store 3", "type": Types.draw},
  {"desc": "Play 3 cards per turn", "ticks": 0, "name": "Multitasking 3", "type": Types.play},
  {"desc": "Play 2 cards per turn", "ticks": 0, "name": "Multitasking 2", "type": Types.play},
  {"desc": "All scripts and ends that are drawn must be played", "ticks": 0, "name": "Child's Play", "type": Types.command},
  {"desc": "Discard two cards to draw from the top of the discard", "ticks": 0, "name": "Recycle Bin", "type": Types.command},
  {"desc": "Draw 8 cards, then give a card to each player from your hand", "ticks": 0, "name": "Bytes and Pieces", "type": Types.command},
  {"desc": "Hand limit is now 4", "ticks": 0, "name": "Just a Nibble", "type": Types.command},
  {"desc": "Program/virus limit is now 4", "ticks": 0, "name": "Stock Wares", "type": Types.command},
  {"desc": "Discard two cards to move a virus from player to player", "ticks": 0, "name": "Quarantine", "type": Types.command},
  {"desc": "Make a copy of a card, and give it to another player", "ticks": 0, "name": "Copy/Paste", "type": Types.command},
  {"desc": "Draw an additional card for each timer in play", "ticks": 0, "name": "Overclocked", "type": Types.command},
  {"desc": "Draw an additional card for each program you have, discard an additional card for each virus you have.", "ticks": 0, "name": "GPU Accelerated", "type": Types.command},
  {"desc": "You may let a player steal a random card from your hand to draw two cards", "ticks": 0, "name": "Ask Your Grandson", "type": Types.command},
  {"desc": "Discard all rules cards, including this one.", "ticks": 0, "name": "Clear Command Line", "type": Types.command},
  {"desc": "Play with hands open", "ticks": 0, "name": "Public Network", "type": Types.command},
  {"desc": "", "ticks": "0", "name": "Tick!", "type": Types.tick},
  {"desc": "", "ticks": "0", "name": "Tick!", "type": Types.tick},
  {"desc": "", "ticks": "0", "name": "Tick!", "type": Types.tick},
  {"desc": "", "ticks": "0", "name": "Tick!", "type": Types.tick}
]
