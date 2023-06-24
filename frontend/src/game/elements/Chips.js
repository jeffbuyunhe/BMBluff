import {
  CHIP_COLOURS,
  CHIP_HEIGHT,
  CHIP_POSITION_HORIZONTAL,
  CHIP_POSITION_VERTICAL,
  CHIP_WIDTH,
  PLAYER_CHIP_COORDINATES,
  USER_HEIGHT,
} from "../constants";

export default class Chips {
  constructor(x, y, balance, vertical, p5) {
    this.x = x;
    this.y = y;
    this.balance = balance;
    this.prevBalance = 0;
    this.chipsCount = [0, 0, 0, 0, 0, 0, 0];
    this.vertical = vertical;
    this.graphic = p5.createGraphics(USER_HEIGHT, USER_HEIGHT);
  }

  drawChips(p5) {
    if (this.balance != this.prevBalance) {
      this.graphic.clear();
      let balanceDraw = this.balance;
      this.chipsCount = [0, 0, 0, 0, 0, 0, 0];
      this.calculateChipsCount(balanceDraw);
      this.prevBalance = this.balance;

      this.drawChip(p5, this.chipsCount[6], "1");
      this.drawChip(p5, this.chipsCount[5], "5");
      this.drawChip(p5, this.chipsCount[4], "10");
      this.drawChip(p5, this.chipsCount[3], "25");
      this.drawChip(p5, this.chipsCount[2], "100");
      this.drawChip(p5, this.chipsCount[1], "250");
      this.drawChip(p5, this.chipsCount[0], "1000");
    }
  }

  calculateChipsCount(balance) {
    if (balance - 1000 >= 250) {
      this.chipsCount[0]++;
      this.calculateChipsCount(balance - 1000);
    } else if (balance - 250 >= 100) {
      this.chipsCount[1]++;
      this.calculateChipsCount(balance - 250);
    } else if (balance - 100 >= 25) {
      this.chipsCount[2]++;
      this.calculateChipsCount(balance - 100);
    } else if (balance - 25 >= 10) {
      this.chipsCount[3]++;
      this.calculateChipsCount(balance - 25);
    } else if (balance - 10 >= 5) {
      this.chipsCount[4]++;
      this.calculateChipsCount(balance - 10);
    } else if (balance - 5 >= 0) {
      this.chipsCount[5]++;
      this.calculateChipsCount(balance - 5);
    } else if (balance - 1 >= 0) {
      this.chipsCount[6]++;
      this.calculateChipsCount(balance - 1);
    }
  }

  drawChipTemplate(x, y, colour, accentColour, strokeColour, value, p5) {
    this.graphic.stroke(strokeColour);
    this.graphic.fill(accentColour);
    this.graphic.ellipse(x, y, CHIP_WIDTH, CHIP_HEIGHT);
    this.graphic.fill(colour);
    this.graphic.ellipse(x, y - 2.5, CHIP_WIDTH, CHIP_HEIGHT);
    if (value != "1" && value != "1000") {
      this.graphic.fill(255);
    } else {
      this.graphic.fill(0);
    }
    this.graphic.textFont("Outfit");
    this.graphic.textSize(8);
    this.graphic.noStroke();
    this.graphic.textAlign(p5.CENTER);
    if (value === "1000") {
      value = "1K";
    }
    this.graphic.text(value, x, y);
  }

  drawChip(p5, amount, value) {
    let chipPosition;
    if (this.vertical) {
      chipPosition = CHIP_POSITION_VERTICAL[value];
    } else {
      chipPosition = CHIP_POSITION_HORIZONTAL[value];
    }
    for (let i = 0; i < amount; i++) {
      this.drawChipTemplate(
        chipPosition.x,
        chipPosition.y - 3 * i,
        CHIP_COLOURS[value][0],
        CHIP_COLOURS[value][1],
        CHIP_COLOURS[value][2],
        value,
        p5
      );
    }
  }

  checkOrientation(graphic) {
    if (
      this.x === PLAYER_CHIP_COORDINATES[0].x &&
      this.y === PLAYER_CHIP_COORDINATES[0].y
    ) {
      if (!this.vertical) {
        this.vertical = true;
        this.drawChips(graphic);
      }
    } else if (
      this.x === PLAYER_CHIP_COORDINATES[3].x &&
      this.y === PLAYER_CHIP_COORDINATES[3].y
    ) {
      if (!this.vertical) {
        this.vertical = true;
        this.drawChips(graphic);
      }
    } else {
      if (this.vertical) {
        this.vertical = false;
        this.drawChips(graphic);
      }
    }
  }

  show(graphic) {
    this.checkOrientation(graphic);
    this.drawChips(graphic);
    graphic.image(this.graphic, this.x, this.y);
  }
}
