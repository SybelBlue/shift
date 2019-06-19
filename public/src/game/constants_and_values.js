const Types = Object.freeze({
  play: {
      name: 'play',
      color: [250, 100, 50], //redish
      desc: 'Play at least the number of cards described below each turn.'
    },
  draw: {
      name: 'draw',
      color: [50, 50, 250], //blue
      desc: 'Draw the number of cards described below each turn.'
    },
  command: {
      name: 'command',
      color: [244, 189, 48], // saffron
      desc: 'This card alters the rules of the game for all players.'
    },
  end: {
      name: 'end',
      color: [50, 200, 50], // green
      desc: 'You win the game...'
    },
  tick: {
      name: 'tick',
      color: [117, 221, 221], //teal
      desc: 'Tick tock!'
    },
  script: {
      name: 'script',
      color: [150, 50, 250],
      desc: 'This card is good for one use. Use wisely and discard.'
    },
  program: {
      name: 'program',
      color: [255, 151, 102], // pink-orange
      desc: 'This card will remain on the desktop until removal.'
    },
  virus: {
      name: 'virus',
      color: [55, 55, 55], //grey
      desc: 'This card will remain on the desktop until removal.'
    }
});


const CARDS_DRAWN = 'cards_drawn_this_turn',
    CARDS_TO_DRAW = 'cards_to_draw_this_turn',
    CARDS_PLAYED = 'cards_played_this_turn',
    CARDS_TO_PLAY = 'cards_to_play_this_turn',
    CARDS_DISCARDED = 'cards_discarded_this_turn',
    TICKS_PLAYED = 'tick_cards_in_play',
    TICKS_PLAYABLE = 'tick_cards_can_be_played',
    MUST_PLAYS = 'cards_that_are_played_immediately',
    OPTIONALS_PLAYED = 'opt_actions_played_this_turn',
    STEALABLE = 'can_be_stolen_from',
    TRANSFERABLE = 'can_be_transferred_from',
    HAND_LIMITS = 'max_hand_size_at_turn_end',
    TYPE_LIMITS = 'max_number_of_cards_per_type',
    WINABLE = 'can_win',
    WIN_CONDITIONS = 'predicates_if_win',
    CARD_COUNT_MIN = 'hand_size_low',
    CARD_COUNT_MAX = 'hand_size_high',
    CARD_COUNT_START = 'hand_size_at_turn_start';

const REMOVE_ACTION = 'remove_this_from_action_queue',
    HALT_FIRE = 'halt_fire';

var game = {
  debug:  {
    active: false,
    loud: true,
    log: function(quiet, loud=undefined, deep=undefined) {
      if (deep) {
        console.log(new Error(deep).stack);
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
  allCards: [],
  players: [],
  typedDiscards: [],
  events: {},
  values: {
    reset: function() {
      game.values[CARDS_DRAWN] = 0;
      game.values[CARDS_TO_DRAW] = () => 1;
      game.values[CARDS_PLAYED] = 0;
      game.values[CARDS_TO_PLAY] = () => 1;
      game.values[CARDS_DISCARDED] = 0;
      game.values[CARD_COUNT_START] = 0;
      game.values[CARD_COUNT_MAX] = 0;
      game.values[CARD_COUNT_MIN] = 0;
      game.values[TICKS_PLAYED] = 0;
      game.values[MUST_PLAYS] = [Types.virus];
      game.values[OPTIONALS_PLAYED] = 0;
      // TODO: make these active
      game.values[STEALABLE] = []; // contains card id's that prohibit stealing
      game.values[TRANSFERABLE] = []; // ''' that prohibit transfering
      game.values[TICKS_PLAYABLE] = []; // ''' that prohibit play of tick cards
      game.values[WINABLE] = []; // ''' that prohibit winning
      game.values[HAND_LIMITS] = []; // all limits enforced on hand
      game.values[TYPE_LIMITS] = []; // obj.id = cardid, obj.types=[types], obj.limit=number
      game.values[WIN_CONDITIONS] = []; // obj.id = cardid, obj.cond=condition
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

var hourglass_icon, graffiti_text_font, /*brux_font,*/ halt_font, mechanical_font;
function preload() {
  makeSocket();
  hourglass_icon = loadImage('res/hourglass_icon.png');
  graffiti_text_font = loadFont('res/GraffitiPaintBrush.ttf');
  // brux_font = loadFont('res/webfontkit/brux-regular-webfont.woff');
  halt_font = loadFont('res/Halt.ttf');
  mechanical_font = loadFont('/res/mechanical/Mechanical.otf');
  main_font = mechanical_font;
}
