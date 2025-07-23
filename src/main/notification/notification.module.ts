import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [NotificationGateway, JwtService],
  controllers: [NotificationController],
  exports: [NotificationGateway],
  imports: [
    BullModule.registerQueue({
      name: 'notification', // * MUST match the @InjectQueue('notification')
    }),
  ],
})
export class NotificationModule {}
