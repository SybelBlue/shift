class Toast extends Clickable {
  constructor() {
    super(createVector(-10, -10), [10, 10]);
    this.cornerRoundPx = CORNER_ROUNDING;
    this.scale = 1;
  }

  toast(val, duration=4) {
    textSize(30);
    var bbox = main_font.textBounds(val, width, 80, 30);
    this.position = createVector((width - bbox.w) / 2, -bbox.h-40);
    this.lerpTo(createVector((width - bbox.w) / 2, 80));
    this.dimension = [bbox.w + 20, bbox.h + 20];
    this.text = val;
    this.endTime = Date.now() + duration * 1000;
  }

  display() {
    if (this.text) {
      if (this.targetPosition) {
        this.position = this.nextLerpPosition_();
      }

      fill(55, 55, 55, 55);
      this.makeBody();
      noStroke();
      fill(45);
      textSize(30);
      textAlign(CENTER, CENTER);
      text(this.text, this.position.x + this.width/2,
        this.position.y + this.height/2);

      if (this.endTime && this.endTime < Date.now()) {
        this.lerpTo(createVector(this.x, -this.height - 20));
        this.endTime = null;
      }

      if (!this.endTime && this.y + this.height < 0) {
        this.text = null;
      }
    }
  }

  makeBody(position=this.position) {
    rect(position.x, position.y,
         ...this.dimension.map(n => n * this.scale),
         ...this.cornerRoundPx.map(n => n * this.scale));
  }
}
