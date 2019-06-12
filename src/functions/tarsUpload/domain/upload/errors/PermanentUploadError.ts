export class PermanentUploadError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, PermanentUploadError.prototype);
  }
}
