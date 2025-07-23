import { Module } from '@nestjs/common';
import { TimeoffRequestController } from './timeoff-request.controller';
import { OffDayRequestService } from './services/off-day-request.service';
import { AdminRequestOffDayController } from './admin-request-off-day.controller';
import { AdminRequestOffDayService } from './services/admin-request-off-day.service';

@Module({
  controllers: [TimeoffRequestController, AdminRequestOffDayController],
  providers: [OffDayRequestService, AdminRequestOffDayService],
})
export class TimeoffRequestModule {}
