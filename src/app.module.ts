import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryModule } from './telemetry/telemetry.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'energy',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TelemetryModule,   
    AnalyticsModule,   
  ],
})
export class AppModule {}
