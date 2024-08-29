export class ValidationError extends Error {
  constructor(
    public errorCode: string,
    message: string,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
