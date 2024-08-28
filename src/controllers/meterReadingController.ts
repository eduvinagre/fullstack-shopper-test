import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extractMeasureValue } from '../services/geminiService';
import { checkDuplicateReading, saveMeterReading } from '../services/meterReadingService';

export const uploadReading = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    const isDuplicate = await checkDuplicateReading(
      customer_code,
      measure_type,
      new Date(measure_datetime),
    );
    if (isDuplicate) {
      return res.status(409).json({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    const measureValue = await extractMeasureValue(image);

    // Generate temporary URL for image (mock)
    const imageUrl = `https://example.com/temp-images/${uuidv4()}.jpg`;

    const savedReading = await saveMeterReading(
      customer_code,
      measure_type,
      new Date(measure_datetime),
      measureValue,
      imageUrl,
    );

    const response = {
      image_url: savedReading.imageUrl,
      measure_value: savedReading.measureValue,
      measure_uuid: savedReading.id,
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
