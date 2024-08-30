import { PrismaClient } from '@prisma/client';
import { MeterReading } from '../types/meterReading';

const prisma = new PrismaClient();

export const checkDuplicateReading = async (
  customerCode: string,
  measureType: string,
  measureDatetime: Date,
): Promise<boolean> => {
  const existingReading = await prisma.meterReading.findFirst({
    where: {
      customerCode,
      measureType,
      measureDatetime: {
        gte: new Date(measureDatetime.getFullYear(), measureDatetime.getMonth(), 1),
        lt: new Date(measureDatetime.getFullYear(), measureDatetime.getMonth() + 1, 1),
      },
    },
  });
  return !!existingReading;
};

export const saveMeterReading = async (
  customerCode: string,
  measureType: string,
  measureDatetime: Date,
  measureValue: number,
  imageUrl: string,
) => {
  return prisma.meterReading.create({
    data: {
      customerCode,
      measureType,
      measureDatetime,
      measureValue,
      imageUrl,
    },
  });
};

export const findMeterReading = async (measureUuid: string) => {
  return prisma.meterReading.findUnique({
    where: { id: measureUuid },
  });
};

export const confirmMeterReading = async (measureUuid: string, confirmedValue: number) => {
  return prisma.meterReading.update({
    where: { id: measureUuid },
    data: { confirmed: true, measureValue: confirmedValue },
  });
};

export const listMeasuresByCustomer = async (
  customerCode: string,
  measureType?: string,
): Promise<MeterReading[]> => {
  return prisma.meterReading.findMany({
    where: {
      customerCode,
      ...(measureType && { measureType: measureType.toUpperCase() }),
    },
  }) as Promise<MeterReading[]>;
};
