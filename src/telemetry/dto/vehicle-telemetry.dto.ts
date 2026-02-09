import { IsString, IsNumber, IsDateString } from 'class-validator';

export class VehicleTelemetryDto {
  @IsString()
  vehicleId: string;

  @IsNumber()
  soc: number;

  @IsNumber()
  kwhDeliveredDc: number;

  @IsNumber()
  batteryTemp: number;

  @IsDateString()
  timestamp: string;
}
