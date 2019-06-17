class Clickable extends Transformable {
  constructor(position, dimension) {
    super(position, dimension);
    this.interactable_ = true;
    this.targetPosition_;
    this.animStart;
  }

  centerOn(x, y, lerp=false) {
    var pos = createVector();
    pos.x = x - this.width / 2;
    pos.y = y - this.height / 2;
    if (lerp) {
      this.lerpTo(pos, lerp.speed || ANIM_MILLIS);
    } else {
      this.position = pos;
    }
  }

  centerOnMouse(lerp={speed: ANIM_MILLIS * 3/4}) {
    this.centerOn(mouseX, mouseY, lerp);
  }

  lerp_(t) {
    return t*t*t*(t * (6*t - 15) + 10);
  }

  lerpTo(targetPosition, speed=ANIM_MILLIS) {
    if (this.position == targetPosition) {
      return;
    }
    this.targetPosition = targetPosition;
    this.animStart = {time: Date.now(), pos: this.position, speed: speed};
  }

  nextLerpPosition_() {
    var t = (Date.now() - this.animStart.time) / this.animStart.speed;
    if (t >= 1) {
      var next = this.targetPosition;
      this.targetPosition = null;
      this.animStart = null;
      return next;
    }
    var r = this.lerp_(t);
    var delta = p5.Vector.sub(this.targetPosition, this.animStart.pos);
    delta.mult(r);
    return p5.Vector.add(this.animStart.pos, delta);
  }

  testInteract(x=mouseX, y=mouseY) {
    return this.interactable && this.testHit(x, y);
  }

  set targetPosition(value) {
    this.targetPosition_ = value;
  }

  get targetPosition() {
    return this.targetPosition_;
  }

  set interactable(value) {
    this.interactable_ = value;
  }

  get interactable() {
    return this.interactable_;
  }

  select() {}
}
