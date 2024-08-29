import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errors';
import { validationResult } from 'express-validator';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(err.errorCode === 'DOUBLE_REPORT' ? 409 : 400).json({
      error_code: err.errorCode,
      error_description: err.message,
    });
  }

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: validationErrors.array()[0].msg,
    });
  }

  res.status(500).json({
    error_code: 'INTERNAL_SERVER_ERROR',
    error_description: 'An unexpected error occurred',
  });
};

export default errorHandler;
