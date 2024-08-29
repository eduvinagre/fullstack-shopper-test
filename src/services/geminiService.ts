import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const extractMeasureValue = async (imageBase64: string): Promise<number> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt =
    'Analyze this image of a water or gas meter. What is the current reading shown on the meter? Please respond with only the numeric value, without any additional text or explanation.';

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64,
      },
    },
  ]);

  const response = await result.response;
  const measureValue = parseFloat(response.text());

  if (isNaN(measureValue)) {
    throw new Error('Failed to extract measure value from image');
  }

  return measureValue;
};
