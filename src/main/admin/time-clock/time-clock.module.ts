import { Module } from '@nestjs/common';
import { ClockSheetService } from '@project/main/user/user-time-click/services/clock-sheet.service';
import { MissedClockRequestService } from '@project/main/user/user-time-click/services/missed-clock-request.service';
import { ManageClockRequestController } from './controllers/manage-clock-request.controller';
import { TimeClockController } from './controllers/time-clock.controller';
import { ManageClockRequestService } from './services/manage-clock-request.service';
import { OvertimeService } from './services/overtime.service';
import { PayrollService } from './services/payroll.service';
import { ShiftRequestService } from './services/shift-request.service';
import { TimeSheetService } from './services/time-sheet.service';

@Module({
  controllers: [TimeClockController, ManageClockRequestController],
  providers: [
    ShiftRequestService,
    PayrollService,
    TimeSheetService,
    OvertimeService,
    ManageClockRequestService,
    ClockSheetService,
    MissedClockRequestService,
  ],
})
export class TimeClockModule {}
