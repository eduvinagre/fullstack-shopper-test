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
  return true;
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
    confirmed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const findMeterReading = async (measureUuid: string): Promise<MeterReading | null> => {
  // Implementação mock. Em uma aplicação real, você faria uma consulta ao banco de dados aqui.
  // Por exemplo:
  // return await MeterReading.findOne({ where: { id: measureUuid } });

  // Para fins de demonstração, vamos retornar um objeto mock se o UUID for '12345'
  if (measureUuid === '12345') {
    return {
      id: '12345',
      customerCode: 'CUST001',
      measureType: 'WATER',
      measureDatetime: new Date(),
      measureValue: 100,
      imageUrl: 'https://example.com/image.jpg',
      confirmed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  return null;
};

export const confirmMeterReading = async (
  measureUuid: string,
  confirmedValue: number,
): Promise<void> => {
  // Mock implementation. Same as the others above.
  // Another thought:
  // await MeterReading.update({ confirmed: true, measureValue: confirmedValue }, { where: { id: measureUuid } });

  console.log(`Confirmando leitura ${measureUuid} com valor ${confirmedValue}`);
};