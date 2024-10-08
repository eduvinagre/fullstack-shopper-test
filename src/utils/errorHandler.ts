import { Request, Response, NextFunction } from 'express';
import { ValidationError, NotFoundError, ConflictError } from './errors';
import { validationResult } from 'express-validator';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error_code: err.errorCode,
      error_description: err.message,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error_code: err.errorCode,
      error_description: err.message,
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({
      error_code: err.errorCode,
      error_description: err.message,
    });
  }

  res.status(500).json({
    error_code: 'INTERNAL_SERVER_ERROR',
    error_description: 'An unexpected error occurred',
  });
};

export default errorHandler;
