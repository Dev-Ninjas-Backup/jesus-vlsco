import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationGateway } from './notification.gateway';
import { CompanyAnnouncementWorker } from './worker/company-announcement.worker';

@Module({
  providers: [NotificationGateway, JwtService, CompanyAnnouncementWorker],
  controllers: [],
  exports: [NotificationGateway],
  imports: [
    BullModule.registerQueue({
      name: 'notification', // * MUST match the @InjectQueue('notification')
    }),
  ],
})
export class NotificationModule {}
