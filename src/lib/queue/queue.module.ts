import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { CompanyAnnouncementWorker } from './worker/company-announcement.worker';

@Global()
@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'announcement' },
      { name: 'notification' },
      { name: 'shift' },
      { name: 'email' },
    ),
  ],
  providers: [CompanyAnnouncementWorker],
  exports: [BullModule],
})
export class QueueModule {}
