import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('current_vehicle_status')
export class CurrentVehicleStatus {
  @PrimaryColumn()
  vehicleId: string;

  @Column('float')
  soc: number;

  @Column('float')
  lastKwhDeliveredDc: number;

  @Column('float')
  batteryTemp: number;

  @Column({ type: 'timestamptz' })
  lastUpdatedAt: Date;
}
