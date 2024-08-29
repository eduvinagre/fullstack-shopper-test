import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extractMeasureValue } from '../services/geminiService';
import {
  checkDuplicateReading,
  saveMeterReading,
  confirmMeterReading,
  findMeterReading,
} from '../services/meterReadingService';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errors';

export const uploadReading = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    const isDuplicate = await checkDuplicateReading(
      customer_code,
      measure_type,
      new Date(measure_datetime),
    );
    if (isDuplicate) {
      throw new ConflictError('DOUBLE_REPORT', 'Leitura do mês já realizada');
    }

    const measureValue = await extractMeasureValue(image);

    // Gerar URL temporária para a imagem (mock)
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

export const confirmReading = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { measure_uuid, confirmed_value } = req.body;

    const existingReading = await findMeterReading(measure_uuid);
    if (!existingReading) {
      throw new NotFoundError('MEASURE_NOT_FOUND', 'Leitura não encontrada');
    }

    if (existingReading.confirmed) {
      throw new ConflictError('CONFIRMATION_DUPLICATE', 'Leitura já confirmada');
    }

    await confirmMeterReading(measure_uuid, confirmed_value);

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
