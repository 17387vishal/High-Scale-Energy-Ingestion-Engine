import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { VehicleTelemetryHistory } from '../database/entities/vehicle-telemetry-history.entity';
import { CurrentVehicleStatus } from '../database/entities/current-vehicle-status.entity';
import { MeterTelemetryHistory } from '../database/entities/meter-telemetry-history.entity';
import { CurrentMeterStatus } from '../database/entities/current-meter-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleTelemetryHistory,
      CurrentVehicleStatus,
      MeterTelemetryHistory,
      CurrentMeterStatus,
    ]),
  ],
  controllers: [TelemetryController],   // ✅ HERE
  providers: [TelemetryService],        // ✅ HERE
})
export class TelemetryModule {}
