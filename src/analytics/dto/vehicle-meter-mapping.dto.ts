import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVehicleMeterMappingDto {
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @IsString()
  @IsNotEmpty()
  meterId: string;
}
