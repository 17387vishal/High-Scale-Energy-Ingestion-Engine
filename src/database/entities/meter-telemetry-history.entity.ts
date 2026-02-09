import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('meter_telemetry_history')
@Index(['meterId', 'timestamp'])
export class MeterTelemetryHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  meterId: string;

  @Column('float')
  kwhConsumedAc: number;

  @Column('float')
  voltage: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;
}
