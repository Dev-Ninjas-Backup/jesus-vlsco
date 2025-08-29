import { Module } from '@nestjs/common';
import { PayrollService } from './services/payroll.service';
import { ShiftRequestService } from './services/shift-request.service';
import { TimeSheetService } from './services/time-sheet.service';
import { TimeClockController } from './time-clock.controller';
import { OvertimeService } from './services/overtime.service';

@Module({
  controllers: [TimeClockController],
  providers: [
    ShiftRequestService,
    PayrollService,
    TimeSheetService,
    OvertimeService,
  ],
})
export class TimeClockModule {}
