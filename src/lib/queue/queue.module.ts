import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { CompanyAnnouncementWorker } from './worker/company-announcement.worker';
import { ShiftWorker } from './worker/shift.worker';

@Global()
@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'announcement' },
      { name: 'timeoff' },
      { name: 'shift' },
    ),
  ],
  providers: [CompanyAnnouncementWorker, ShiftWorker],
  exports: [BullModule],
})
export class QueueModule {}
