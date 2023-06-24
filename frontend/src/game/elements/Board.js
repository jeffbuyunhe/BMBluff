import { BOARD_HEIGHT, BOARD_WIDTH } from "../constants";

export default class Board {
  constructor(x, y, p5) {
    this.x = x;
    this.y = y;
    this.graphic = p5.createGraphics(BOARD_WIDTH, BOARD_HEIGHT);
  }

  //generate board
  initBoard() {
    this.graphic.fill(45, 156, 91);
    this.graphic.strokeWeight(10);
    this.graphic.stroke(140, 88, 63);
    this.graphic.rect(3, 3, BOARD_WIDTH - 20, BOARD_HEIGHT - 20, 30);
  }

  show(graphic) {
    graphic.image(this.graphic, this.x, this.y);
  }
}
