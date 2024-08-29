import { body, validationResult } from 'express-validator';
import { isValidBase64 } from '../utils/validateBase64';
import { ValidationError } from '../utils/errors';
import { Request, Response, NextFunction } from 'express';

export const validateUpload = [
  body('image').custom((value) => {
    if (!isValidBase64(value)) {
      throw new ValidationError('INVALID_DATA', 'Invalid base64 image');
    }
    return true;
  }),
  body('customer_code').isString().withMessage('Customer code must be a string'),
  body('measure_datetime').isISO8601().withMessage('Invalid date format'),
  body('measure_type').isIn(['WATER', 'GAS']).withMessage('Measure type must be WATER or GAS'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array()[0];
      throw new ValidationError('INVALID_DATA', error.msg);
    }
    next();
  },
];
