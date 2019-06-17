class SelectionStack {
  constructor() {
    this.items = [];
    this.mode = SelectionStack.SINGLE;
  }

  push(item) {
    switch (this.mode) {
      case SelectionStack.SINGLE:
        this.items = [item];
        return;
      case SelectionStack.MULTI:
        this.items.push(item);
        return;
    }
  }

  pop() {
    switch (this.mode) {
      case SelectionStack.SINGLE:
      case SelectionStack.MULTI:
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

  reverse() {
    return this.items.reverse();
  }

  static SINGLE = 0;
  static MULTI = 1;
}
