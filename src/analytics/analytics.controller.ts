import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateVehicleMeterMappingDto } from './dto/vehicle-meter-mapping.dto';

@Controller('v1/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('performance/:vehicleId')
  getPerformance(@Param('vehicleId') vehicleId: string) {
    return this.analyticsService.getVehiclePerformance(vehicleId);
  }

  @Post('mappings')
  createMapping(@Body() dto: CreateVehicleMeterMappingDto) {
    return this.analyticsService.createMapping(dto.vehicleId, dto.meterId);
  }

  @Put('mappings/:vehicleId')
  updateMapping(
    @Param('vehicleId') vehicleId: string,
    @Body() dto: CreateVehicleMeterMappingDto,
  ) {
    return this.analyticsService.createMapping(vehicleId, dto.meterId);
  }

  @Get('mappings/:vehicleId')
  getMapping(@Param('vehicleId') vehicleId: string) {
    return this.analyticsService.getMapping(vehicleId);
  }
}
