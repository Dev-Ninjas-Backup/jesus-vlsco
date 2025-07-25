import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import { ShiftEvent } from '@project/common/interface/events';
import { MailService } from '@project/lib/mail/mail.service';
import { NotificationGateway } from '@project/lib/notification/notification.gateway';
import { UtilsService } from '@project/lib/utils/utils.service';
import { Worker } from 'bullmq';

@Injectable()
export class ShiftWorker implements OnModuleInit {
  // LOGGER
  private logger = new Logger(ShiftWorker.name);
  constructor(
    private readonly gateway: NotificationGateway,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    private readonly utils: UtilsService
  ) { }

  onModuleInit() {
    new Worker<ShiftEvent>(
      'shift',
      async (job) => {
        const { shiftId, userId, action, meta } = job.data;

        const userEmail = await this.utils.getEmailById(userId);
        const shiftDetails = await this.utils.getShiftById(shiftId);

        this.logger.log(`Shift ${shiftId} assigned to ${userEmail}`);

        // Broadcast via email

        // Broadcast via WebSocket

      },
      {
        connection: {
          host: this.config.getOrThrow(ENVEnum.REDIS_HOST),
          port: +this.config.getOrThrow(ENVEnum.REDIS_PORT),
        },
      },
    );
  }
}
