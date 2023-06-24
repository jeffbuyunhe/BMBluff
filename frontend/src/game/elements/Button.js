import {
  BUTTON_WIDTH,
  BUTTON_HEIGHT,
  BUTTON_WIDTH_MINI,
  BUTTON_HEIGHT_MINI,
  COLOURS,
} from "../constants";
export default class Button {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
  }

  generateButton(p5) {
    let button = p5.createButton(this.text);
    button.size(BUTTON_WIDTH, BUTTON_HEIGHT);
    button.position(this.x, this.y);
    this.styleButton(button);
    button.hide();
    return button;
  }

  generateMiniButton(p5) {
    let button = p5.createButton(this.text);
    button.size(BUTTON_WIDTH_MINI, BUTTON_HEIGHT_MINI);
    button.position(this.x, this.y);
    this.styleButton(button);
    button.style("font-size", "20px");
    button.hide();
    return button;
  }

  styleButton(button) {
    button.style("font-family", "Outfit");
    button.style("font-size", "28px");
    button.style("padding", "0px");
    button.style("border-color", COLOURS["light-blue"]);
    button.style("border-radius", "10px");
    button.style("color", COLOURS["navy-blue"]);
  }
}
