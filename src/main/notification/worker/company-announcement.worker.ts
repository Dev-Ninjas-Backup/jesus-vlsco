import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import { Worker } from 'bullmq';
import { AnnouncementEvent } from '../interface/events';
import { NotificationGateway } from '../notification.gateway';

@Injectable()
export class CompanyAnnouncementWorker implements OnModuleInit {
  constructor(
    private readonly gateway: NotificationGateway,
    private readonly configService: ConfigService,
  ) { }

  onModuleInit() {
    new Worker<AnnouncementEvent>(
      'notification',
      async (job) => {
        if (job.name === 'create-announcement:broadcast') {
          await this.handleBroadcast(job.data);
        }
      },
      {
        connection: {
          host: this.configService.getOrThrow(ENVEnum.REDIS_HOST),
          port: Number(this.configService.get(ENVEnum.REDIS_PORT)),
        },
      },
    );
  }

  private async handleBroadcast(data: AnnouncementEvent) {
    await this.gateway.server.emit('announcement', data);
  }
}
