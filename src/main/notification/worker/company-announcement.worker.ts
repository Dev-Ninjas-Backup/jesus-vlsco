import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import { Worker } from 'bullmq';
import { AnnouncementEvent, EVENT_TYPES } from '../interface/events';
import { NotificationGateway } from '../notification.gateway';

@Injectable()
export class CompanyAnnouncementWorker implements OnModuleInit {
  constructor(
    private readonly gateway: NotificationGateway,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    new Worker<AnnouncementEvent>(
      'notification',
      async (job) => {
        if (job.name === EVENT_TYPES.COMPANY_ANNOUNCEMENT_BROADCAST) {
          await this.gateway.server.emit('announcement', job.data);
        }
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
