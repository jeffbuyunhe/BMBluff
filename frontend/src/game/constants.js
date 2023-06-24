//ANNOUNCEMENTS
export const ANNOUNCE_WAITING_TO_START = "Waiting for game to start...";
export const ANNOUNCE_PLAYER_COUNT = "Must have more than one player";
export const ANNOUNCE_CURRENT_TURN = "Current Turn: \n";

//COLOURS
export const COLOURS = {
  "navy-blue": "rgb(29, 110, 161)",
  "light-blue": "rgb(99, 182, 235)",
  "pale-red": "rgb(255, 236, 235)",
  "dark-red": "rgb(173, 29, 19)",
  salmon: "rgb(224, 136, 130)",
};

//CANVAS
export const CANVAS_WIDTH = 1600;
export const CANVAS_HEIGHT = 850;

//BOARD
export const BOARD_WIDTH = 1000;
export const BOARD_HEIGHT = 425;

//BUTTON
export const BUTTON_WIDTH = 195;
export const BUTTON_HEIGHT = 45;
export const BUTTON_WIDTH_MINI = 80;
export const BUTTON_HEIGHT_MINI = 35;
export const BUTTON_SPACE = 250;

export const BUTTON_CALL_X = (CANVAS_WIDTH - BOARD_WIDTH) / 2 + 140;
export const BUTTON_RAISE_X = BUTTON_CALL_X + BUTTON_SPACE;
export const BUTTON_FOLD_X = BUTTON_CALL_X + 2 * BUTTON_SPACE;
export const BUTTON_Y = 450;

//SLIDER
export const SLIDER_RAISE_WIDTH =
  BUTTON_WIDTH * 3 + (BUTTON_SPACE - BUTTON_WIDTH) * 2 - 200;

//INPUT
export const INPUT_RAISE_WIDTH = 110;
export const INPUT_X = 950;

//CARD
export const CARD_WIDTH = 67;
export const CARD_HEIGHT = 100;

export const VALUES = {
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "J",
  12: "Q",
  13: "K",
  14: "A",
};

export const UNKNOWN_CARD = "?";
export const UNKNOWN_VALUE = "";
export const UNKNOWN_MOVE = "";

export const MOVES = {
  Fold: "Fold",
  Raise: "Raise",
  Call: "Call",
};

export const ROOM_STATUS = {
  Waiting: "Waiting",
  InGame: "InGame",
};

export const SUIT_ICONS = {
  clubs: "♣",
  spades: "♠",
  diamonds: "♦",
  hearts: "♥",
};
export const SUIT_COLOURS = {
  "♣": "black",
  "♠": "black",
  "♦": "red",
  "♥": "red",
};

//CHIPS
export const CHIP_WIDTH = 18;
export const CHIP_HEIGHT = 12;

//amount: [colour, accentColour, strokeColour]
export const CHIP_COLOURS = {
  1: ["rgb(255, 255, 255)", "rgb(250, 250, 250)", "rgb(230, 230, 230)"],
  5: ["rgb(255, 55, 55)", "rgb(212, 55, 55)", "rgb(186, 55, 55)"],
  10: ["rgb(55, 55, 255)", "rgb(55, 55, 212)", "rgb(55, 55, 186)"],
  25: ["rgb(55, 255, 55)", "rgb(55, 212, 55)", "rgb(55, 186, 55)"],
  100: ["rgb(0, 0, 0)", "rgb(5, 5, 55)", "rgb(25, 25, 25)"],
  250: ["rgb(255, 192, 203)", "rgb(255, 162, 163)", "rgb(255, 20, 147)"],
  1000: ["rgb(255, 255, 55)", "rgb(225, 225, 55)", "rgb(186, 186, 55)"],
};

export const CHIP_POSITION_HORIZONTAL = {
  1: { x: 20, y: 20 },
  5: { x: 40, y: 20 },
  10: { x: 60, y: 20 },
  25: { x: 80, y: 20 },
  100: { x: 100, y: 20 },
  250: { x: 120, y: 20 },
  1000: { x: 140, y: 20 },
};

export const CHIP_POSITION_VERTICAL = {
  1: { x: 10, y: 20 },
  5: { x: 10, y: 35 },
  10: { x: 10, y: 50 },
  25: { x: 10, y: 65 },
  100: { x: 10, y: 80 },
  250: { x: 10, y: 95 },
  1000: { x: 10, y: 110 },
};

export const POT_X = CANVAS_WIDTH / 2 - 90;
export const POT_Y = CANVAS_HEIGHT / 2 - 45;

export const POT_TEXT_X = CANVAS_WIDTH / 2 - 10;
export const POT_TEXT_Y = CANVAS_HEIGHT / 2;

//USER
export const USER_WIDTH = 270;
export const USER_HEIGHT = 200;

//USER COORDINATES
export const PLAYER_COORDINATES = [
  { x: 15, y: 320 },
  { x: BOARD_WIDTH - 2.5 * USER_WIDTH, y: 5 },
  { x: BOARD_WIDTH, y: 5 },
  { x: 30 + BOARD_WIDTH + USER_WIDTH, y: 320 },
  { x: BOARD_WIDTH, y: BOARD_HEIGHT + USER_HEIGHT + 20 },
  { x: BOARD_WIDTH - 2.5 * USER_WIDTH, y: BOARD_HEIGHT + USER_HEIGHT + 20 },
];

export const PLAYER_CHIP_COORDINATES = [
  {
    x: PLAYER_COORDINATES[0].x + USER_WIDTH + 30,
    y: PLAYER_COORDINATES[0].y + 30,
  },
  {
    x: PLAYER_COORDINATES[1].x + 40,
    y: PLAYER_COORDINATES[1].y + USER_HEIGHT + 20,
  },
  {
    x: PLAYER_COORDINATES[2].x + 40,
    y: PLAYER_COORDINATES[2].y + USER_HEIGHT + 20,
  },
  {
    x: PLAYER_COORDINATES[3].x - 50,
    y: PLAYER_COORDINATES[3].y + 30,
  },
  {
    x: PLAYER_COORDINATES[4].x + 40,
    y: PLAYER_COORDINATES[4].y - 65,
  },
  {
    x: PLAYER_COORDINATES[5].x + 40,
    y: PLAYER_COORDINATES[5].y - 65,
  },
];

//VIDEO
export const VIDEO_WIDTH = 180;
export const VIDEO_HEIGHT = 125;

//TENSORFLOW
export const KEY_TO_CARD = {
  33: "2s",
  34: "2c",
  35: "2d",
  36: "2h",
  37: "3s",
  38: "3c",
  39: "3d",
  40: "3h",
  41: "4s",
  42: "4c",
  43: "4d",
  44: "4h",
  45: "5s",
  46: "5c",
  47: "5d",
  48: "5h",
  49: "6s",
  50: "6c",
  51: "6d",
  52: "6h",
  1: "7s",
  2: "8s",
  3: "9s",
  4: "Qs",
  5: "Ks",
  6: "10s",
  7: "As",
  8: "Js",
  9: "7h",
  10: "8h",
  11: "9h",
  12: "Qh",
  13: "Kh",
  14: "10h",
  15: "Ah",
  16: "Jh",
  17: "7d",
  18: "8d",
  19: "9d",
  20: "Qd",
  21: "Kd",
  22: "10d",
  23: "Ad",
  24: "Jd",
  25: "7c",
  26: "8c",
  27: "9c",
  28: "Qc",
  29: "Kc",
  30: "10c",
  31: "Ac",
  32: "Jc",
};

export const CARD_TO_CARD_SUITS = {
  c: "clubs",
  d: "diamonds",
  h: "hearts",
  s: "spades",
};

export const CARD_TO_CARD_VALUES = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};
