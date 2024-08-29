import express from 'express';
import { uploadReading, confirmReading, listMeasures } from '../controllers/meterReadingController';
import {
  validateUpload,
  validateConfirmation,
  validateListMeasures,
} from '../middleware/validateRequest';

const router = express.Router();

router.post('/upload', validateUpload, uploadReading);
router.patch('/confirm', validateConfirmation, confirmReading);
router.get('/:customer_code/list', validateListMeasures, listMeasures);

export default router;
