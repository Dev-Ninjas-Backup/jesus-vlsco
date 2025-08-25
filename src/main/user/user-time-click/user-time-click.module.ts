import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ClockInOutService } from './services/clock-in-out.service';
import { TimeClockService } from './services/time-clock.service';
import { UserTimeClickService } from './services/user-time-click.service';
import { TimeClockGateway } from './time-clock.gateway';
import { UserTimeClickController } from './user-time-click.controller';

@Module({
  controllers: [UserTimeClickController],
  providers: [
    UserTimeClickService,
    ClockInOutService,
    TimeClockService,
    TimeClockGateway,
    JwtService,
  ],
})
export class UserTimeClickModule {}
