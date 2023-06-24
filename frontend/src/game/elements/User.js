import { MOVES } from "../constants.js";
import {
  CARD_WIDTH,
  CARD_HEIGHT,
  VIDEO_HEIGHT,
  USER_WIDTH,
  USER_HEIGHT,
  COLOURS,
  UNKNOWN_MOVE,
} from "../constants.js";
import Chips from "./Chips.js";

export default class User {
  constructor(x, y, username, card, video, p5) {
    this.x = x;
    this.y = y;
    this.graphicname = username;
    this.balance = 1000;
    this.chips = new Chips(0, 0, this.balance, false, p5);
    this.card = card;
    this.move = UNKNOWN_MOVE;
    this.video = video;
    this.graphic = p5.createGraphics(USER_WIDTH, USER_HEIGHT);
    this.initUser(p5);
  }

  initUser(p5) {
    if (this.move === MOVES.Fold) {
      this.card.initFoldedCard();
    } else {
      this.card.initCard();
    }
    //generate user card background
    this.graphic.fill(COLOURS["light-blue"]);
    this.graphic.strokeWeight(3);
    this.graphic.stroke(COLOURS["navy-blue"]);
    this.graphic.rect(1, 1, USER_WIDTH - 6, USER_HEIGHT - 6, 10);

    this.card.x = 5;
    this.card.y = 5 + (VIDEO_HEIGHT - CARD_HEIGHT) / 2;
    this.card.show(this.graphic);

    this.video.x = 10 + CARD_WIDTH;
    this.video.y = 7;
    this.video.show(this.graphic);

    //write username and balance
    this.graphic.textFont("Outfit");
    this.graphic.textSize(16);
    this.graphic.fill(0);
    this.graphic.noStroke();
    this.graphic.textAlign(this.graphic.CENTER);
    this.graphic.text(this.graphicname, USER_WIDTH / 2, VIDEO_HEIGHT + 25);

    this.graphic.textSize(20);
    this.graphic.textAlign(this.graphic.LEFT);
    this.graphic.text("Balance: " + this.balance, 10, VIDEO_HEIGHT + 55);
  }

  initShowdownUser(p5) {
    this.card.initCard();
    //generate user card background
    this.graphic.fill(COLOURS["light-blue"]);
    this.graphic.strokeWeight(3);
    this.graphic.stroke(COLOURS["navy-blue"]);
    this.graphic.rect(1, 1, USER_WIDTH - 6, USER_HEIGHT - 6, 10);

    this.card.x = 5;
    this.card.y = 5 + (VIDEO_HEIGHT - CARD_HEIGHT) / 2;
    this.card.show(this.graphic);

    this.video.x = 10 + CARD_WIDTH;
    this.video.y = 7;
    this.video.show(this.graphic);

    //write username and balance
    this.graphic.textFont("Outfit");
    this.graphic.textSize(16);
    this.graphic.fill(0);
    this.graphic.noStroke();
    this.graphic.textAlign(this.graphic.CENTER);
    this.graphic.text(this.graphicname, USER_WIDTH / 2, VIDEO_HEIGHT + 25);

    this.graphic.textSize(20);
    this.graphic.textAlign(this.graphic.LEFT);
    this.graphic.text("Balance: " + this.balance, 10, VIDEO_HEIGHT + 55);
  }

  initHiddenUser(p5) {
    this.card.initHiddenCard();
    //generate user card background
    this.graphic.fill(COLOURS["light-blue"]);
    this.graphic.strokeWeight(3);
    this.graphic.stroke(COLOURS["navy-blue"]);
    this.graphic.rect(1, 1, USER_WIDTH - 6, USER_HEIGHT - 6, 10);

    this.card.x = 5;
    this.card.y = 5 + (VIDEO_HEIGHT - CARD_HEIGHT) / 2;
    this.card.initHiddenCard();
    this.card.show(this.graphic);

    //write username and balance
    this.graphic.textFont("Outfit");
    this.graphic.textSize(16);
    this.graphic.fill(0);
    this.graphic.noStroke();
    this.graphic.textAlign(this.graphic.CENTER);
    this.graphic.text(this.graphicname, USER_WIDTH / 2, VIDEO_HEIGHT + 25);

    this.graphic.textSize(20);
    this.graphic.textAlign(this.graphic.LEFT);
    this.graphic.text("Balance: " + this.balance, 10, VIDEO_HEIGHT + 55);

    //fill in blank space from webcam
    this.graphic.textSize(32);
    this.graphic.text("You", 140, 80);
  }

  initStartUser(p5) {
    this.card.initHiddenCard();
    //generate user card background
    this.graphic.fill(COLOURS["light-blue"]);
    this.graphic.strokeWeight(3);
    this.graphic.stroke(COLOURS["navy-blue"]);
    this.graphic.rect(1, 1, USER_WIDTH - 6, USER_HEIGHT - 6, 10);

    this.card.x = 5;
    this.card.y = 5 + (VIDEO_HEIGHT - CARD_HEIGHT) / 2;
    this.card.show(this.graphic);

    this.video.x = 10 + CARD_WIDTH;
    this.video.y = 7;
    this.video.show(this.graphic);

    //write username and balance
    this.graphic.textFont("Outfit");
    this.graphic.textSize(16);
    this.graphic.fill(0);
    this.graphic.noStroke();
    this.graphic.textAlign(this.graphic.CENTER);
    this.graphic.text(this.graphicname, USER_WIDTH / 2, VIDEO_HEIGHT + 25);
  }

  updateBalance(balance) {
    this.balance = balance;
    this.chips.balance = balance;
  }

  show(graphic) {
    graphic.image(this.graphic, this.x, this.y);
  }
}
