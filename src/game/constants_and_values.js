const CARDS_DRAWN = 'cards_drawn_this_turn',
    CARDS_TO_DRAW = 'cards_to_draw_this_turn',
    CARDS_PLAYED = 'cards_played_this_turn',
    CARDS_TO_PLAY = 'cards_to_play_this_turn',
    CARDS_DISCARDED = 'cards_discarded_this_turn';

var game = {
  debug:  {
    active: true,
    loud: true,
    log: function(quiet, loud=undefined, deep=undefined) {
      if (deep) {
        console.log(new Event(deep).stack);
      }
      if (game.debug.active) {
        if (!loud || !game.debug.loud) {
          console.log(quiet);
        } else {
          console.log({quiet: quiet, loud: loud});
        }
      }
    }
  },
  selectedStack: [],
  allCards: [],
  players: [],
  typedDiscards: [],
  events: {},
  values: {
    reset: function() {
      game.values[CARDS_DRAWN] = 0;
      game.values[CARDS_TO_DRAW] = (...args) => 1;
      game.values[CARDS_PLAYED] = 0;
      game.values[CARDS_TO_PLAY] =(...args) => 1;
      game.values[CARDS_DISCARDED] = 0;
      game.debug.log('game values reset', game.values);
    }
  }
};

game.values.reset();


const ANIM_MILLIS = 300;

const CARD_WIDTH = 120, CARD_HEIGHT = 200;
const CORNER_ROUNDING = [3, 12, 3, 12];
const COLOR_BAND_WIDTH = 15;

const HAND_HEIGHT = CARD_HEIGHT + 20;
const DECK_WIDTH = CARD_WIDTH + 20, DECK_HEIGHT = HAND_HEIGHT;

let hourglass_icon, graffiti_text_font, brux_font, halt_font;
function preload() {
  hourglass_icon = loadImage('res/hourglass_icon.png');
  graffiti_text_font = loadFont('res/GraffitiPaintBrush.ttf');
  // brux_font = loadFont('res/webfontkit/brux-regular-webfont.woff');
  halt_font = loadFont('res/Halt.ttf');
  main_font = halt_font;
}
