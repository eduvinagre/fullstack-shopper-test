import express from 'express';
import { uploadReading, confirmReading } from '../controllers/meterReadingController';
import { validateUpload, validateConfirmation } from '../middleware/validateRequest';

const router = express.Router();

router.post('/upload', validateUpload, uploadReading);
router.patch('/confirm', validateConfirmation, confirmReading);

export default router;
