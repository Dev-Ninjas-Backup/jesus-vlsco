import { Module } from '@nestjs/common';
import { TimeClockController } from './controllers/time-clock.controller';
import { OvertimeService } from './services/overtime.service';
import { PayrollService } from './services/payroll.service';
import { ShiftRequestService } from './services/shift-request.service';
import { TimeSheetService } from './services/time-sheet.service';
import { ManageClockRequestController } from './controllers/manage-clock-request.controller';
import { ManageClockRequestService } from './services/manage-clock-request.service';

@Module({
  controllers: [TimeClockController, ManageClockRequestController],
  providers: [
    ShiftRequestService,
    PayrollService,
    TimeSheetService,
    OvertimeService,
    ManageClockRequestService,
  ],
})
export class TimeClockModule {}
