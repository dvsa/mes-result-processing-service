export class TransientUploadError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, TransientUploadError.prototype);
  }
}
