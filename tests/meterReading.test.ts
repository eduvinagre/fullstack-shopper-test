import { Request, Response } from 'express';
import { uploadReading, confirmReading, listMeasures } from '../src/controllers/meterReadingController';
import { extractMeasureValue } from '../src/services/geminiService';
import {
  checkDuplicateReading,
  saveMeterReading,
  findMeterReading,
  confirmMeterReading,
  listMeasuresByCustomer,
} from '../src/services/meterReadingService';
import { ConflictError, NotFoundError } from '../src/utils/errors';

jest.mock('../services/geminiService');
jest.mock('../services/meterReadingService');

describe('meterReadingController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('uploadReading', () => {
    beforeEach(() => {
      mockRequest.body = {
        image: 'base64encodedimage',
        customer_code: 'CUST001',
        measure_datetime: '2024-03-15T10:00:00Z',
        measure_type: 'WATER',
      };
    });

    it('should return 200 and upload details for a successful new reading', async () => {
      (checkDuplicateReading as jest.Mock).mockResolvedValue(false);
      (extractMeasureValue as jest.Mock).mockResolvedValue(100.5);
      (saveMeterReading as jest.Mock).mockResolvedValue({
        id: 'mocked-uuid',
        imageUrl: 'https://example.com/temp-images/mocked-uuid.jpg',
        measureValue: 100.5,
      });

      await uploadReading(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        image_url: 'https://example.com/temp-images/mocked-uuid.jpg',
        measure_value: 100.5,
        measure_uuid: 'mocked-uuid',
      });
    });

    it('should call next with ConflictError (409) if reading already exists for the month', async () => {
      (checkDuplicateReading as jest.Mock).mockResolvedValue(true);

      await uploadReading(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ConflictError));
      expect(mockNext.mock.calls[0][0].errorCode).toBe('DOUBLE_REPORT');
    });

    it('should call next with error if measure value extraction fails', async () => {
      (checkDuplicateReading as jest.Mock).mockResolvedValue(false);
      (extractMeasureValue as jest.Mock).mockRejectedValue(new Error('Extraction failed'));

      await uploadReading(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('confirmReading', () => {
    beforeEach(() => {
      mockRequest.body = {
        measure_uuid: 'mocked-uuid',
        confirmed_value: 100,
      };
    });

    it('should return 200 for a successful confirmation', async () => {
      (findMeterReading as jest.Mock).mockResolvedValue({ confirmed: false });
      (confirmMeterReading as jest.Mock).mockResolvedValue({});

      await confirmReading(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ success: true });
    });

    it('should call next with NotFoundError (404) if reading is not found', async () => {
      (findMeterReading as jest.Mock).mockResolvedValue(null);

      await confirmReading(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(mockNext.mock.calls[0][0].errorCode).toBe('MEASURE_NOT_FOUND');
    });

    it('should call next with ConflictError (409) if reading is already confirmed', async () => {
      (findMeterReading as jest.Mock).mockResolvedValue({ confirmed: true });

      await confirmReading(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(ConflictError));
      expect(mockNext.mock.calls[0][0].errorCode).toBe('CONFIRMATION_DUPLICATE');
    });
  });

  describe('listMeasures', () => {
    beforeEach(() => {
      mockRequest.params = { customer_code: 'CUST001' };
      mockRequest.query = {};
    });

    it('should return 200 and list of measures for a customer', async () => {
      const mockMeasures = [
        {
          id: 'uuid1',
          measureDatetime: new Date('2024-03-15T10:00:00Z'),
          measureType: 'WATER',
          confirmed: true,
          imageUrl: 'https://example.com/image1.jpg',
        },
        {
          id: 'uuid2',
          measureDatetime: new Date('2024-04-15T10:00:00Z'),
          measureType: 'GAS',
          confirmed: false,
          imageUrl: 'https://example.com/image2.jpg',
        },
      ];
      (listMeasuresByCustomer as jest.Mock).mockResolvedValue(mockMeasures);

      await listMeasures(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        customer_code: 'CUST001',
        measures: [
          {
            measure_uuid: 'uuid1',
            measure_datetime: mockMeasures[0].measureDatetime,
            measure_type: 'WATER',
            has_confirmed: true,
            image_url: 'https://example.com/image1.jpg',
          },
          {
            measure_uuid: 'uuid2',
            measure_datetime: mockMeasures[1].measureDatetime,
            measure_type: 'GAS',
            has_confirmed: false,
            image_url: 'https://example.com/image2.jpg',
          },
        ],
      });
    });

    it('should filter measures by type when measure_type query param is provided', async () => {
      mockRequest.query = { measure_type: 'WATER' };
      const mockMeasures = [
        {
          id: 'uuid1',
          measureDatetime: new Date('2024-03-15T10:00:00Z'),
          measureType: 'WATER',
          confirmed: true,
          imageUrl: 'https://example.com/image1.jpg',
        },
      ];
      (listMeasuresByCustomer as jest.Mock).mockResolvedValue(mockMeasures);

      await listMeasures(mockRequest as Request, mockResponse as Response, mockNext);

      expect(listMeasuresByCustomer).toHaveBeenCalledWith('CUST001', 'WATER');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        customer_code: 'CUST001',
        measures: [
          {
            measure_uuid: 'uuid1',
            measure_datetime: mockMeasures[0].measureDatetime,
            measure_type: 'WATER',
            has_confirmed: true,
            image_url: 'https://example.com/image1.jpg',
          },
        ],
      });
    });

    it('should call next with NotFoundError (404) if no measures are found', async () => {
      (listMeasuresByCustomer as jest.Mock).mockResolvedValue([]);

      await listMeasures(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(mockNext.mock.calls[0][0].errorCode).toBe('MEASURES_NOT_FOUND');
    });
  });
});
