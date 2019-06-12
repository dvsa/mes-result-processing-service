export class UploadFailureWithRetryCountError extends Error {
  cause: Error;
  retryCount: number;

  constructor(cause: Error, retryCount: number) {
    super(cause.message);
    this.cause = cause;
    this.retryCount = retryCount;
    Object.setPrototypeOf(this, UploadFailureWithRetryCountError.prototype);
  }
}
