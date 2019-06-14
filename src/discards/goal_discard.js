class GoalDiscard extends TypedDiscard {
  constructor(position, limit=1) {
    super(position, Types.end, null, limit);
  }
}
