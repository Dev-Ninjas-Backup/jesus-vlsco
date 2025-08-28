import { Module } from '@nestjs/common';
import { PayrollService } from './services/payroll.service';
import { TimeClockService } from './services/time-clock.service';
import { TimeClockController } from './time-clock.controller';
import { TimeSheetService } from './services/time-sheet.service';

@Module({
  controllers: [TimeClockController],
  providers: [TimeClockService, PayrollService, TimeSheetService],
})
export class TimeClockModule {}
