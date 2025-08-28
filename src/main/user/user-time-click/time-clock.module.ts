import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClockHistoryService } from './services/clock-history.service';
import { ClockInAndOutService } from './services/clock-in-and-out.service';
import { CurrentClockShiftService } from './services/current-shift-clock.service';
import { TimeClockService } from './services/time-clock.service';
import { UserShiftService } from './services/user-shift.service';
import { TimeClockController } from './time-clock.controller';
import { TimeClockGateway } from './time-clock.gateway';
import { ClockReportingService } from './services/clock-reporting.service';

@Module({
  controllers: [TimeClockController],
  providers: [
    UserShiftService,
    CurrentClockShiftService,
    TimeClockService,
    TimeClockGateway,
    JwtService,
    ClockInAndOutService,
    ClockHistoryService,
    ClockReportingService,
  ],
})
export class TimeClockModule {}
