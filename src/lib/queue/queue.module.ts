import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { QueueName } from '@project/common/interface/queue-name';
import { CompanyEventService } from './services/company-event.service';
import { CompanyAnnouncementWorker } from './worker/company-announcement.worker';
import { ShiftWorker } from './worker/shift.worker';
import { ShiftEventService } from './services/shift-event.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue(
      { name: QueueName.ANNOUNCEMENT },
      { name: QueueName.TIME_OFF },
      { name: QueueName.SHIFT },
      { name: QueueName.COMPANY_EVENT },
    ),
  ],
  providers: [
    CompanyAnnouncementWorker,
    ShiftWorker,
    CompanyEventService,
    ShiftEventService,
  ],
  exports: [BullModule],
})
export class QueueModule {}
