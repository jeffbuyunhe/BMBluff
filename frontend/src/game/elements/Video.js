import { VIDEO_WIDTH, VIDEO_HEIGHT } from "../constants";

export default class Video {
  constructor(x, y, stream, p5) {
    this.x = x;
    this.y = y;
    this.mediaElement = p5.createVideo("");
    this.mediaElement.elt.srcObject = stream;
    this.mediaElement.size(VIDEO_WIDTH, VIDEO_HEIGHT);
    //hide video in DOM
    this.mediaElement.play();
    this.mediaElement.hide();
  }

  show(graphic) {
    graphic.image(this.mediaElement, this.x, this.y);
  }
}
