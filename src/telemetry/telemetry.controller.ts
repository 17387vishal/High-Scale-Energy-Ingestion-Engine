import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';

@Controller('v1/telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post()
  async ingest(@Body() payload: MeterTelemetryDto | VehicleTelemetryDto) {
    // Polymorphic ingestion: route based on payload type
    if ('meterId' in payload) {
      return this.telemetryService.ingestMeter(payload as MeterTelemetryDto);
    }

    if ('vehicleId' in payload) {
      return this.telemetryService.ingestVehicle(payload as VehicleTelemetryDto);
    }

    throw new BadRequestException('Unknown telemetry type. Must include either meterId or vehicleId');
  }
}
