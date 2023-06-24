import { COLOURS, INPUT_RAISE_WIDTH } from "../constants";
export default class Input {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
  }

  generateInput(p5) {
    let input = p5.createInput(this.text);
    input.position(this.x, this.y);
    this.styleInput(input);
    input.hide();
    return input;
  }

  styleInput(input) {
    input.style("color", COLOURS["navy-blue"]);
    input.style("width", INPUT_RAISE_WIDTH + "px");
    input.style("font-size", "24px");
    input.style("font-family", "Outfit");
    input.style("border-radius", "5px");
    input.style("border-color", COLOURS["navy-blue"]);
  }
}
