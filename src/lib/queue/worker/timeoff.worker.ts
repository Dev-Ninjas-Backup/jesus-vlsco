import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import { TimeOffEvent } from '@project/common/interface/events';
import { MailService } from '@project/lib/mail/mail.service';
import { NotificationGateway } from '@project/lib/notification/notification.gateway';
import { Worker } from 'bullmq';

@Injectable()
export class TimeOffWorker implements OnModuleInit {
  // LOGGER
  private logger = new Logger(TimeOffWorker.name);
  constructor(
    private readonly gateway: NotificationGateway,
    private readonly config: ConfigService,
    private readonly mailService: MailService,
  ) {}

  onModuleInit() {
    new Worker<TimeOffEvent>(
      'timeoff',
      async (job) => {
        // const { action, requestId, userId, meta } = job.data;
        console.log(job.data, 'job.data');

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
