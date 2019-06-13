export class TestResultError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, TestResultError.prototype);
  }
}
