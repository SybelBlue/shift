// class TurnList {
//   constructor(player) {
//     this.player = player;
//     game.turnList = this;
//     this.actionStack = [];
//     this.actionStack.push(this.drawFn());
//   }
//
//   drawFn() {
//     return () => {
//       while (game.values[CARDS_TO_DRAW]() > game.values[CARDS_DRAWN]) {
//         game.deck.draw(this.player);
//       }
//     }
//   }
//
//   push(item) {
//     this.actionStack.push(item);
//   }
//
//   fire() {
//     if (this.actionStack.length) {
//       this.actionStack.pop()(arguments);
//     }
//   }
// }
