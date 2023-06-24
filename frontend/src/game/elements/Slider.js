import { SLIDER_RAISE_WIDTH } from "../constants";
import "./Slider.css";
export default class Slider {
  constructor(x, y, min, max) {
    this.x = x;
    this.y = y;
    this.min = min;
    this.max = max;
  }

  generateSlider(p5) {
    let slider = p5.createSlider(this.min, this.max);
    slider.position(this.x, this.y);
    this.styleSlider(slider);
    slider.hide();
    return slider;
  }

  styleSlider(slider) {
    slider.style("width", SLIDER_RAISE_WIDTH + "px");
  }
}
