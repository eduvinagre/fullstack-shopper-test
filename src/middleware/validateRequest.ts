import {
  body,
  param,
  query,
  validationResult,
  ValidationError as ExpressValidationError,
} from 'express-validator';
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
  handleValidationErrors,
];

export const validateConfirmation = [
  body('measure_uuid').isString().withMessage('Measure UUID must be a string'),
  body('confirmed_value').isInt().withMessage('Confirmed value must be an integer'),
  handleValidationErrors,
];

export const validateListMeasures = [
  param('customer_code').isString().withMessage('Customer code must be a string'),
  query('measure_type')
    .optional()
    .isIn(['WATER', 'GAS', 'water', 'gas'])
    .withMessage('Measure type must be WATER or GAS'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorArray = errors.array();
      const measureTypeError = errorArray.find((err) => {
        return (
          'location' in err &&
          'path' in err &&
          err.location === 'query' &&
          err.path === 'measure_type'
        );
      });
      if (measureTypeError) {
        throw new ValidationError('INVALID_TYPE', 'Tipo de medição não permitida');
      }
      throw new ValidationError('INVALID_DATA', errorArray[0].msg);
    }
    next();
  },
];

function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    throw new ValidationError('INVALID_DATA', errorArray[0].msg);
  }
  next();
}
