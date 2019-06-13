class Transformable {
  constructor(position, dimension) {
    this.position = position;
    this.dimension = dimension;
    this.id = Date.now();
    this.visible_ = true;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  set x(value) {
    this.position.x = value;
  }

  set y(value) {
    this.position.y = value;
  }

  get width() {
    return this.dimension[0];
  }

  get height() {
    return this.dimension[1];
  }

  set width(value) {
    this.dimension[0] = value;
  }

  set height(value) {
    this.dimension[1] = value;
  }

  set visible(value) {
    this.visible_ = value;
  }

  get visible() {
    return this.visible_;
  }

  testHit(x=mouseX, y=mouseY) {
    return this.position.x <= x && x <= this.position.x + this.width &&
           this.position.y <= y && y <= this.position.y + this.height;
  }

  overlaps(other, askOther=true) {
    return this.testHit(other.x, other.y) ||
        this.testHit(other.x + other.width, other.y + other.height) ||
        this.testHit(other.x, other.y + other.height) ||
        this.testHit(other.x + other.width, other.y) ||
        other.overlaps(this, false);
  }
}
