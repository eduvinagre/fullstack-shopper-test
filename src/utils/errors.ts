export class ValidationError extends Error {
  constructor(
    public errorCode: string,
    message: string,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(
    public errorCode: string,
    message: string,
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(
    public errorCode: string,
    message: string,
  ) {
    super(message);
    this.name = 'ConflictError';
  }
}
