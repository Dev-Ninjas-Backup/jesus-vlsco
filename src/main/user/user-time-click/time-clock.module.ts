import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TimeClockController } from './controllers/time-clock.controller';
import { ClockHistoryService } from './services/clock-history.service';
import { ClockInAndOutService } from './services/clock-in-and-out.service';
import { ClockReportingService } from './services/clock-reporting.service';
import { ClockSheetService } from './services/clock-sheet.service';
import { CurrentClockShiftService } from './services/current-shift-clock.service';
import { MissedClockRequestService } from './services/missed-clock-request.service';
import { TimeClockService } from './services/time-clock.service';
import { UserShiftService } from './services/user-shift.service';
import { TimeClockGateway } from './time-clock.gateway';
import { RequestMissedClockController } from './controllers/request-missed-clock.controller';

@Module({
  controllers: [TimeClockController, RequestMissedClockController],
  providers: [
    UserShiftService,
    CurrentClockShiftService,
    TimeClockService,
    TimeClockGateway,
    JwtService,
    ClockInAndOutService,
    ClockHistoryService,
    ClockReportingService,
    ClockSheetService,
    MissedClockRequestService,
  ],
})
export class TimeClockModule {}
