import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import { AnnouncementEvent } from '@project/common/interface/events-payload';
import { MailService } from '@project/lib/mail/mail.service';
import { NotificationGateway } from '@project/lib/notification/notification.gateway';
import { Worker } from 'bullmq';

@Injectable()
export class CompanyAnnouncementWorker implements OnModuleInit {
  private readonly logger = new Logger(CompanyAnnouncementWorker.name);

  constructor(
    private readonly config: ConfigService,
    private readonly mailService: MailService,
    private readonly gateway: NotificationGateway,
  ) { }

  onModuleInit() {
    new Worker<AnnouncementEvent>(
      'notification',
      async (job) => {
        if (job.name !== 'announcement:create') return;

        const { title, message, recipients, sendEmail, sendWs } = job.data;

        if (sendEmail) {
          for (const email of recipients) {
            try {
              await this.mailService.sendEmail(
                email,
                title,
                `<h3>${title}</h3><p>${message}</p>`,
              );
              this.logger.log(`Email sent: ${email}`);
            } catch (err) {
              this.logger.error(`Email failed: ${email}`, err);
            }
          }
        }

        if (sendWs) {
          for (const userId of recipients) {
            this.gateway.server
              .to(userId)
              .emit('announcement', { title, message });
          }
        }
      },
      { connection: { host: this.config.get(ENVEnum.REDIS_HOST), port: +this.config.get(ENVEnum.REDIS_PORT) } },
    );
  }
}

