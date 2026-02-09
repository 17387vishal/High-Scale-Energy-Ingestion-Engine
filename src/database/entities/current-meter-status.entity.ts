import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('current_meter_status')
export class CurrentMeterStatus {
  @PrimaryColumn()
  meterId: string;

  @Column('float')
  lastKwhConsumedAc: number;

  @Column('float')
  voltage: number;

  @Column({ type: 'timestamptz' })
  lastUpdatedAt: Date;
}
