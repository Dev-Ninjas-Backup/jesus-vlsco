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
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    new Worker<AnnouncementEvent>(
      'notification',
      async (job) => {
        const { title, message, recipients, sendEmail, sendWs } = job.data;

        // – Broadcast via email
        if (sendEmail && recipients.length) {
          // TODO: send email
        }
        console.log(
          '🚀 ~ file: company-announcement.worker.ts ~ line 20 ~ CompanyAnnouncementWorker ~ job',
        );

        // – Broadcast via WebSocket
        if (sendWs && recipients.length) {
          for (const userId of recipients) {
            const sockets = this.gateway.getClientsForUser(userId);
            sockets.forEach((ws) =>
              ws.send(JSON.stringify({ title, message })),
            );
          }
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
