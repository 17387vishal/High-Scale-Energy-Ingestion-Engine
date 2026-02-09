import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleTelemetryHistory } from '../database/entities/vehicle-telemetry-history.entity';
import { CurrentVehicleStatus } from '../database/entities/current-vehicle-status.entity';
import { MeterTelemetryHistory } from '../database/entities/meter-telemetry-history.entity';
import { CurrentMeterStatus } from '../database/entities/current-meter-status.entity';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectRepository(VehicleTelemetryHistory)
    private vehicleHistoryRepo: Repository<VehicleTelemetryHistory>,

    @InjectRepository(CurrentVehicleStatus)
    private vehicleCurrentRepo: Repository<CurrentVehicleStatus>,

    @InjectRepository(MeterTelemetryHistory)
    private meterHistoryRepo: Repository<MeterTelemetryHistory>,

    @InjectRepository(CurrentMeterStatus)
    private meterCurrentRepo: Repository<CurrentMeterStatus>,
  ) {}

  async ingestVehicle(data: VehicleTelemetryDto) {
    const timestamp = new Date(data.timestamp);

    // History Path: Append-only INSERT for audit trail
    await this.vehicleHistoryRepo.insert({
      vehicleId: data.vehicleId,
      soc: data.soc,
      kwhDeliveredDc: data.kwhDeliveredDc,
      batteryTemp: data.batteryTemp,
      timestamp,
    });

    // Live Path: Atomic UPSERT for current status (avoids scanning millions of rows)
    await this.vehicleCurrentRepo.upsert(
      {
        vehicleId: data.vehicleId,
        soc: data.soc,
        lastKwhDeliveredDc: data.kwhDeliveredDc,
        batteryTemp: data.batteryTemp,
        lastUpdatedAt: timestamp,
      },
      {
        conflictPaths: ['vehicleId'],
      },
    );

    return { status: 'vehicle telemetry ingested' };
  }

  async ingestMeter(data: MeterTelemetryDto) {
    const timestamp = new Date(data.timestamp);

    // History Path: Append-only INSERT for audit trail
    await this.meterHistoryRepo.insert({
      meterId: data.meterId,
      kwhConsumedAc: data.kwhConsumedAc,
      voltage: data.voltage,
      timestamp,
    });

    // Live Path: Atomic UPSERT for current status (avoids scanning millions of rows)
    await this.meterCurrentRepo.upsert(
      {
        meterId: data.meterId,
        lastKwhConsumedAc: data.kwhConsumedAc,
        voltage: data.voltage,
        lastUpdatedAt: timestamp,
      },
      {
        conflictPaths: ['meterId'],
      },
    );

    return { status: 'meter telemetry ingested' };
  }
}
