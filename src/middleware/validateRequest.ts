import { body } from 'express-validator';
import { isValidBase64 } from '../utils/validateBase64';

export const validateUpload = [
  body('image').custom((value) => {
    if (!isValidBase64(value)) {
      throw new Error('Invalid base64 image');
    }
    return true;
  }),
  body('customer_code').isString(),
  body('measure_datetime').isISO8601(),
  body('measure_type').isIn(['WATER', 'GAS']),
];
