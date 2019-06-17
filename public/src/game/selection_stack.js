class SelectionStack {
  constructor() {
    this.items = [];
    this.mode_ = SelectionStack.SINGLE_CLASS;
  }

  push(item) {
    switch (this.mode_) {
      case SelectionStack.SINGLE:
        this.items = [item];
        return;
      case SelectionStack.MULTI:
        this.items.push(item);
        return;
      case SelectionStack.SINGLE_CLASS:
        var protoName = item.constructor.name;
        this.items = this.items.filter(o => o.constructor.name !== protoName);
        this.items.push(item);
        return;
    }
  }

  pop() {
    switch (this.mode_) {
      case SelectionStack.SINGLE:
      case SelectionStack.MULTI:
      default:
        return this.items.pop();
    }
  }

  peek() {
    return this.items.peek();
  }

  includes(item) {
    return this.items.includes(item);
  }

  remove(item) {
    return this.items.splice(this.items.indexOf(item), 1);
  }

  get length() {
    return this.items.length;
  }

  get mode() {
    return this.mode_;
  }

  set mode(value) {
    this.mode_ = value;
    if (value == SelectionStack.SINGLE_CLASS) {
      this.items = [null, null];
    }
  }

  reverse() {
    return this.items.reverse();
  }

  static SINGLE = 0;
  static MULTI = 1;
  static SINGLE_CLASS = 2;
}
