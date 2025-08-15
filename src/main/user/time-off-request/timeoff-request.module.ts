import { Module } from '@nestjs/common';
import { AdminRequestOffDayController } from './controller/admin-request-off-day.controller';
import { TimeoffRequestController } from './controller/timeoff-request.controller';
import { AdminRequestOffDayService } from './services/admin-request-off-day.service';
import { OffDayRequestService } from './services/off-day-request.service';

@Module({
  controllers: [AdminRequestOffDayController, TimeoffRequestController],
  providers: [AdminRequestOffDayService, OffDayRequestService],
})
export class TimeoffRequestModule {}
