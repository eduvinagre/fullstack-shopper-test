import express from 'express';
import { uploadReading } from '../controllers/meterReadingController';
import { validateUpload } from '../middleware/validateRequest';

const router = express.Router();

router.post('/upload', validateUpload, uploadReading);

export default router;
