export interface MeterReading {
  id: string;
  customerCode: string;
  measureType: string;
  measureDatetime: Date;
  measureValue: number;
  imageUrl: string;
  confirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
