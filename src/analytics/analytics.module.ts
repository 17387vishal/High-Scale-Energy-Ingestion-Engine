import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { VehicleTelemetryHistory } from '../database/entities/vehicle-telemetry-history.entity';
import { MeterTelemetryHistory } from '../database/entities/meter-telemetry-history.entity';
import { VehicleMeterMapping } from '../database/entities/vehicle-meter-mapping.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VehicleTelemetryHistory,
        MeterTelemetryHistory,
        VehicleMeterMapping, 
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
