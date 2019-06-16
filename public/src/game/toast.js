class Toast extends Clickable {
  constructor(manager, textColor) {
    super(createVector(-10, -10), [10, 10]);
    this.cornerRoundPx = CORNER_ROUNDING;
    this.scale = 1;
    this.manager = manager;
    this.textColor = textColor;
  }

  toast(val, depth, duration) {
    textSize(30);
    var bbox = main_font.textBounds(val, width, depth, 30);
    this.position = createVector((width - bbox.w) / 2, -bbox.h-40);
    this.lerpTo(createVector((width - bbox.w) / 2, depth));
    this.dimension = [bbox.w + 20, bbox.h + 20];
    this.text = val;
    this.endTime = Date.now() + duration * 1000;
  }

  display() {
    if (this.text) {
      if (this.targetPosition) {
        this.position = this.nextLerpPosition_();
      }

      fill(55, 55, 55, 200);
      this.makeBody();
      noStroke();
      fill(this.textColor);
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
        this.manager.remove(this);
      }
    }
  }

  makeBody(position=this.position) {
    stroke(55);
    rect(position.x, position.y,
         ...this.dimension.map(n => n * this.scale),
         ...this.cornerRoundPx.map(n => n * this.scale));
  }
}

class Toaster {
  constructor() {
    this.toasts = [];
    this.upperMargin = 50;
    this.duration = 4;
  }

  getDepth_() {
    return this.toasts.map(t => t.height).sum();
  }

  toast(text, textColor=color(254, 255, 234)) {
    var t = new Toast(this, textColor);
    t.toast(text, this.getDepth_() + this.upperMargin, this.duration);
    this.toasts.push(t);
  }

  display() {
    this.toasts.forEach(t => t.display());
  }

  remove(toast) {
    this.toasts.splice(this.toasts.indexOf(toast), 1);
  }
}
