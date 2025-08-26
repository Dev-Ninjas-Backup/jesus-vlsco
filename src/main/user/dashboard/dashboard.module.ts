import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { GetShiftScheduleService } from './services/get-shift-schedule.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, GetShiftScheduleService],
})
export class DashboardModule {}
