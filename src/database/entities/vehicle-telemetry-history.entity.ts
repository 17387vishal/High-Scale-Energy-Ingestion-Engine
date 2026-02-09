import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('vehicle_telemetry_history')
@Index(['vehicleId', 'timestamp'])
export class VehicleTelemetryHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicleId: string;

  @Column('float')
  soc: number;

  @Column('float')
  kwhDeliveredDc: number;

  @Column('float')
  batteryTemp: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;
}
