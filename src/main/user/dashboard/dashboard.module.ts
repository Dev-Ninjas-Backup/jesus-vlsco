import { Module } from '@nestjs/common';
import { GetShiftsService } from '@project/main/admin/shift/services/get-shifts.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './services/dashboard.service';
import { GetShiftScheduleService } from './services/get-shift-schedule.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, GetShiftScheduleService, GetShiftsService],
})
export class DashboardModule {}
