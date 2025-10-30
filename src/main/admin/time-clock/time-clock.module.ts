import { Module } from '@nestjs/common';
import { ClockSheetService } from '@project/main/user/time-clock/services/clock-sheet.service';
import { MissedClockRequestService } from '@project/main/user/time-clock/services/missed-clock-request.service';
import { ManageClockRequestController } from './controllers/manage-clock-request.controller';
import { TimeClockController } from './controllers/time-clock.controller';
import { GetUserReportService } from './services/get-user-report.service';
import { ManageClockRequestService } from './services/manage-clock-request.service';
import { OvertimeService } from './services/overtime.service';
import { PayrollService } from './services/payroll.service';
import { ShiftRequestService } from './services/shift-request.service';
import { TimeSheetService } from './services/time-sheet.service';
import { UpdateTimeClockService } from './services/update-time-clock.service';

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
    GetUserReportService,
    UpdateTimeClockService,
  ],
})
export class TimeClockModule {}
