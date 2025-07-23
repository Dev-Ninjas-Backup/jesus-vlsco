import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NotificationController } from './controller/notification.controller';
import { CompanyAnnouncementEvents } from './events/company-announcement.events';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './services/notification.service';

@Module({
  providers: [
    NotificationGateway,
    JwtService,
    CompanyAnnouncementEvents,
    NotificationService,
  ],
  controllers: [NotificationController],
  exports: [NotificationGateway],
  imports: [
    BullModule.registerQueue({
      name: 'notification', // * MUST match the @InjectQueue('notification')
    }),
  ],
})
export class NotificationModule {}
