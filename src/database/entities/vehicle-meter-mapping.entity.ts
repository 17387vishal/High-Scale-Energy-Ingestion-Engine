import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('vehicle_meter_mapping')
export class VehicleMeterMapping {
  @PrimaryColumn()
  vehicleId: string;

  @Column()
  meterId: string;
}
