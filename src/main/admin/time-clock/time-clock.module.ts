import { Module } from '@nestjs/common';
import { PayrollService } from './services/payroll.service';
import { TimeClockService } from './services/time-clock.service';
import { TimeClockController } from './time-clock.controller';

@Module({
  controllers: [TimeClockController],
  providers: [TimeClockService, PayrollService],
})
export class TimeClockModule {}
