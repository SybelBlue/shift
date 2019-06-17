class Toast extends Clickable {
  constructor(manager, textColor) {
    super(createVector(-10, -10), [10, 10]);
    this.cornerRoundPx = CORNER_ROUNDING;
    this.scale = 1;
    this.manager = manager;
    this.textColor = textColor;
    this.active = false;
  }

  toast(val, depth, duration) {
    textSize(30);
    var bbox = main_font.textBounds(val, width, depth, 30);
    this.position = createVector((width - bbox.w) / 2, -bbox.h-40);
    this.lerpTo(createVector((width - bbox.w) / 2, depth));
    this.dimension = [bbox.w + 20, bbox.h + 20];
    this.text = val;
    this.endTime = Date.now() + duration * 1000;
    this.active = true;
  }

  display() {
    if (this.text) {
      if (this.targetPosition) {
        this.position = this.nextLerpPosition_();
      }

      fill(55, 55, 55, 200);
      strokeWeight(4)
      this.makeBody();
      noStroke();
      fill(this.textColor);
      textSize(30);
      strokeWeight(4);
      textAlign(CENTER, CENTER);
      text(this.text, this.position.x + this.width/2,
        this.position.y + this.height/2);

      if (this.active && this.endTime < Date.now()) {
        this.lerpTo(createVector(this.x, -this.height - 20));
        this.endTime = null;
        this.active = false;
      }

      if (!this.active && this.y + this.height < 0) {
        this.text = null;
        this.manager.remove(this);
      }
    }
  }

  set active(value) {
    this.active_ = value;
    if (!value) {
      this.manager.inactive(this);
    }
  }

  get active() {
    return this.active_;
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

  inactive(toast) {
    var y = this.upperMargin;
    var i = 0;
    for (var t of this.toasts) {
      if (t.active) {
        t.lerpTo(createVector(t.x, y));
        y += t.height;
        i++
      }
    }
  }
}
