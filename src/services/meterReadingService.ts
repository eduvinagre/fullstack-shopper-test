import { MeterReading } from '../models/MeterReading';

export const checkDuplicateReading = async (
  customerCode: string,
  measureType: string,
  measureDatetime: Date,
): Promise<boolean> => {
  // This is a mock implementation. Database goes here.
  // Maybe something like:
  //
  // const existingReading = await MeterReading.findOne({
  //   where: {
  //     customerCode,
  //     measureType,
  //     measureDatetime: {
  //       $gte: startOfMonth(measureDatetime),
  //       $lte: endOfMonth(measureDatetime)
  //     }
  //   }
  // });
  //
  // return !!existingReading;

  // Will just return false to simulate no duplicates NEEDS IMPROVEMENT!!!!
  return false;
};

export const saveMeterReading = async (
  customerCode: string,
  measureType: string,
  measureDatetime: Date,
  measureValue: number,
  imageUrl: string,
): Promise<MeterReading> => {
  // This is a mock implementation. Same as above should have a DB here.
  // Just a thought:
  //
  // const newReading = new MeterReading();
  // newReading.customerCode = customerCode;
  // newReading.measureType = measureType;
  // newReading.measureDatetime = measureDatetime;
  // newReading.measureValue = measureValue;
  // newReading.imageUrl = imageUrl;
  //
  // return await newReading.save();

  // Will return a mock object for now
  return {
    id: '12345',
    customerCode,
    measureType,
    measureDatetime,
    measureValue,
    imageUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
