import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CompanyAnnouncementEvents } from './events/company-announcement.events';
import { NotificationGateway } from './notification.gateway';
import { CompanyAnnouncementWorker } from './worker/company-announcement.worker';

@Module({
  providers: [
    NotificationGateway,
    JwtService,
    CompanyAnnouncementEvents,
    CompanyAnnouncementWorker,
  ],
  controllers: [],
  exports: [NotificationGateway],
  imports: [
    BullModule.registerQueue({
      name: 'notification', // * MUST match the @InjectQueue('notification')
    }),
  ],
})
export class NotificationModule {}
