import { Module } from '@nestjs/common';
import { ClockInOutService } from './services/clock-in-out.service';
import { UserTimeClickService } from './services/user-time-click.service';
import { UserTimeClickController } from './user-time-click.controller';

@Module({
  controllers: [UserTimeClickController],
  providers: [UserTimeClickService, ClockInOutService],
})
export class UserTimeClickModule {}
