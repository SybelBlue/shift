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
      case SelectionStack.TARGETED:
        if (this.selectionArgs.valid(item)) {
          this.items.push(item);
          if (this.selectionArgs.isComplete(this.items)) {
            var out = this.items;
            this.mode = this.selectionArgs.previous.mode;
            this.items = this.selectionArgs.previous.items;
            this.selectionArgs.onComplete(out);
          }
        } else if (item instanceof Card) {
          item.shake();
        }
        return;
    }
  }

  pop() {
    switch (this.mode_) {
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
      this.items = [];
    }
  }

  reverse() {
    return this.items.reverse();
  }

  /**
   * Accepts first n cards of type in types from desktop or hand
   */
  selectNTyped(source, n, callback, types=null, actionString='') {
    this.selectN(source, n,
      item => (types || types.includes(item.type))
              && (item.parent === game.desktop || item.parent === game.hand),
      actionString.length? actionString:
      'select ' + n + 'x' + (types? types.join(', '): '') + '...');
  }

  selectN(source, n, callback, valid=null, actionString='') {
    this.select(
      source,
      valid? item => valid(item): (item) => true,
      (items) => items.length >= n,
      callback,
      actionString
    );
  }

  /**
   * source=card id
   * validItemsFn: ?clickable -> boolean // valid selection
   * completedFn: this.items -> boolean // done waiting for selection
   * callbackFn: this.items -> ? // return selection to
   */
  select(source, validItemsFn, completedFn, callbackFn, actionString='') {
    this.selectionArgs = {
      source: source,
      valid: validItemsFn,
      isComplete: item => completedFn(item) && item !== source,
      onComplete: callbackFn,
      previous: {
        mode: this.mode,
        items: this.items
      }
    };
    this.mode = SelectionStack.TARGETED;
    this.items = [];
    game.debug.log('select requested', arguments);
    if (actionString && actionString.length) {
      game.desktop.pushActionUpdate(actionString);
    }
  }

  static SINGLE = 0;
  static MULTI = 1;
  static SINGLE_CLASS = 2;
  static TARGETED = 3;
}
