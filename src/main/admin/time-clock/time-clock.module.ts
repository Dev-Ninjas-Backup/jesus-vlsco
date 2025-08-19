import { Module } from '@nestjs/common';
import { TimeClockService } from './time-clock.service';
import { TimeClockController } from './time-clock.controller';

@Module({
  controllers: [TimeClockController],
  providers: [TimeClockService],
})
export class TimeClockModule {}
