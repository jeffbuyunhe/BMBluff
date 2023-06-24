import {
  CARD_WIDTH,
  CARD_HEIGHT,
  SUIT_COLOURS,
  UNKNOWN_CARD,
  COLOURS,
} from "../constants.js";
export default class Card {
  constructor(x, y, suit, value, hidden, p5) {
    this.x = x;
    this.y = y;
    this.suit = suit;
    this.value = value;
    this.graphic = p5.createGraphics(CARD_WIDTH, CARD_HEIGHT);
    if (!hidden) this.initCard();
    else this.initHiddenCard();
  }

  initCard() {
    //generate card shape, background, position and outline
    this.graphic.fill(255);
    this.graphic.strokeWeight(1.5);
    this.graphic.stroke(168);
    this.graphic.rect(1, 1, CARD_WIDTH - 3, CARD_HEIGHT - 3, 4);

    //generate card suit and value
    this.graphic.fill(SUIT_COLOURS[this.suit]);
    this.graphic.noStroke();
    this.graphic.textSize(18);
    this.graphic.textFont("Outfit");
    this.graphic.text(this.value, 5, 20);
    this.graphic.text(this.suit, 2, 40);
  }

  initHiddenCard() {
    //generate card shape, background, position and outline
    this.graphic.fill(255);
    this.graphic.strokeWeight(1.5);
    this.graphic.stroke(168);
    this.graphic.rect(1, 1, CARD_WIDTH - 3, CARD_HEIGHT - 3, 4);

    //generate question mark
    this.graphic.fill(0);
    this.graphic.noStroke();
    this.graphic.textSize(18);
    this.graphic.textFont("Outfit");
    this.graphic.text(UNKNOWN_CARD, 5, 20);
  }

  initFoldedCard() {
    //generate card shape, background, position and outline
    this.graphic.fill(COLOURS["pale-red"]);
    this.graphic.strokeWeight(1.5);
    this.graphic.stroke(168);
    this.graphic.rect(1, 1, CARD_WIDTH - 3, CARD_HEIGHT - 3, 4);

    //generate background
    this.graphic.fill(COLOURS["salmon"]);
    this.graphic.strokeWeight(0.5);
    this.graphic.stroke("red");
    this.graphic.rect(7, 7, CARD_WIDTH - 15, CARD_HEIGHT - 15, 4);
    this.graphic.noStroke();
    this.graphic.fill(COLOURS["dark-red"]);
    this.graphic.ellipse(CARD_WIDTH / 2, CARD_HEIGHT / 2, 25, 40);
  }

  show(graphic) {
    graphic.image(this.graphic, this.x, this.y);
  }
}
