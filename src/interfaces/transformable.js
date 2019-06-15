class Transformable {
  constructor(position, dimension) {
    this.position = position;
    this.dimension = dimension;
    this.id = Date.now();
    this.children = [];
    this.visible_ = true;
    this.parent_;
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

  set parent(value) {
    if (this.parent_) {
      this.localPosition.add(this.parent_.position);
    }
    this.parent_ = value;
    this.parent_.children.push(this);
    this.position = this.localPosition;
  }

  get parent() {
    return this.parent_;
  }

  set position(value) {
    if (this.parent) {
      this.localPosition = p5.Vector.sub(value, this.parent.position);
    } else {
      this.localPosition = value;
    }
  }

  get position() {
    if (this.parent) {
      return p5.Vector.add(this.parent.position, this.localPosition);
    }
    return this.localPosition;
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

  copyTransformable() {
    return new Transformable(this.position, this.dimension);
  }
}
