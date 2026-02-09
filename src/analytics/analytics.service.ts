import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleTelemetryHistory } from '../database/entities/vehicle-telemetry-history.entity';
import { MeterTelemetryHistory } from '../database/entities/meter-telemetry-history.entity';
import { VehicleMeterMapping } from '../database/entities/vehicle-meter-mapping.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VehicleTelemetryHistory)
    private vehicleHistoryRepo: Repository<VehicleTelemetryHistory>,

    @InjectRepository(MeterTelemetryHistory)
    private meterHistoryRepo: Repository<MeterTelemetryHistory>,

    @InjectRepository(VehicleMeterMapping)
    private mappingRepo: Repository<VehicleMeterMapping>,
  ) {}

  async createMapping(vehicleId: string, meterId: string) {
    // Use upsert to allow updates if mapping already exists
    await this.mappingRepo.upsert(
      { vehicleId, meterId },
      { conflictPaths: ['vehicleId'] },
    );

    return {
      vehicleId,
      meterId,
      message: 'Vehicle-meter mapping created/updated successfully',
    };
  }

  async getMapping(vehicleId: string) {
    const mapping = await this.mappingRepo.findOne({
      where: { vehicleId },
    });

    if (!mapping) {
      throw new NotFoundException(
        `No meter mapped to vehicle ${vehicleId}`,
      );
    }

    return mapping;
  }

  async getVehiclePerformance(vehicleId: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // ✅ 1. Resolve meter dynamically
    const mapping = await this.mappingRepo.findOne({
      where: { vehicleId },
    });

    if (!mapping) {
      throw new NotFoundException(
        `No meter mapped to vehicle ${vehicleId}`,
      );
    }

    const meterId = mapping.meterId;

    // ✅ 2. Vehicle analytics (DC)
    const vehicleStats = await this.vehicleHistoryRepo
      .createQueryBuilder('v')
      .select([
        'COALESCE(SUM(v.kwhDeliveredDc), 0)::float as dc_delivered',
        'COALESCE(AVG(v.batteryTemp), 0)::float as avg_temp',
      ])
      .where('v.vehicleId = :vehicleId', { vehicleId })
      .andWhere('v.timestamp >= :since', { since })
      .getRawOne();

    // ✅ 3. Meter analytics (AC) — NOW DYNAMIC
    const meterStats = await this.meterHistoryRepo
      .createQueryBuilder('m')
      .select('COALESCE(SUM(m.kwhConsumedAc), 0)::float as ac_consumed')
      .where('m.meterId = :meterId', { meterId })
      .andWhere('m.timestamp >= :since', { since })
      .getRawOne();

    const totalDc = Number(vehicleStats.dc_delivered);
    const totalAc = Number(meterStats.ac_consumed);

    return {
      vehicleId,
      period: 'last_24_hours',
      energy: {
        acConsumed: Number(totalAc.toFixed(2)),
        dcDelivered: Number(totalDc.toFixed(2)),
        efficiencyRatio:
          totalAc > 0 ? Number((totalDc / totalAc).toFixed(2)) : 0,
      },
      battery: {
        avgTemperature: Number(vehicleStats.avg_temp.toFixed(2)),
      },
    };
  }
}
