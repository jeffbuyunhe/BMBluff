export default class Announcement {
  constructor(x, y, text, p5) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.announcement = this.generateAnnouncement(x, y, text, p5);
  }

  generateAnnouncement(x, y, text, p5) {
    let announcement = p5.text(x, y, text);
    return announcement;
  }

  updateAnnouncement(p5) {}
}
