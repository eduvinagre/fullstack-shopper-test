import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error_code: 'INTERNAL_SERVER_ERROR',
    error_description: 'An unexpected error occurred',
  });
};

export default errorHandler;
