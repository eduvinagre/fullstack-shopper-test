export interface MeterReading {
  id: string;
  customerCode: string;
  measureType: string;
  measureDatetime: Date;
  measureValue: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
