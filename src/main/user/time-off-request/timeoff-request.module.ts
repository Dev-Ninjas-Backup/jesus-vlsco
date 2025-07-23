import { Module } from '@nestjs/common';
import { TimeoffRequestController } from './timeoff-request.controller';
import { OffDayRequestService } from './services/off-day-request.service';

@Module({
  controllers: [TimeoffRequestController],
  providers: [OffDayRequestService]
})
export class TimeoffRequestModule {}
