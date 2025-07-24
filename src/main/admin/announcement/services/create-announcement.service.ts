import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import {
  AnnouncementEvent,
  EVENT_TYPES,
} from '@project/main/notification/interface/events';
import { Queue } from 'bullmq';
import { CreateAnnouncementDto } from '../dto/createAnnouncement.dto';

@Injectable()
export class CreateAnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
    @InjectQueue('notification')
    private readonly notificationQueue: Queue<AnnouncementEvent>,
  ) {}

  // Create a new announcement
  @HandleError('Error creating announcement')
  async createAnnouncement(
    data: CreateAnnouncementDto,
    urls: string[],
    userId: string,
  ) {
    console.log(data, "data.teams");
    const announcement = await this.prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        createdBy: userId,
        sendEmailNotification: data.sendEmailNotification,
        enabledReadReceipt: data.enabledReadReceipt,
        categoryId: data.categoryId,
        publishedNow: data.publishedNow,
        publishedAt: data.publishedAt,
        isForAllUsers: data.isForAllUsers,
        attachments: {
          createMany: { data: urls.map((url) => ({ file: url })) },
        },
        ...(data.teams &&
          data.teams.length > 0 && {
            teamAnnouncements: {
              createMany: {
                data: data.teams.map((teamId) => ({ teamId })),
              },
            },
          }),
      },
    });

    const recipients = await this.utils.resolveRecipients(
      data.isForAllUsers || false,
      data.teams,
    );

    const payload: AnnouncementEvent = {
      announcementId: announcement.id,
      title: data.title,
      message: data.description,
      publishedAt: data.publishedNow ? new Date() : data.publishedAt!,
      recipients,
      sendEmail: data.sendEmailNotification || false,
      sendWs: true,
    };

    // 3) Enqueue job (delay if scheduled)
    const delay = data.publishedNow
      ? 0
      : Math.max(0, payload.publishedAt.getTime() - Date.now());

    await this.notificationQueue.add(
      EVENT_TYPES.COMPANY_ANNOUNCEMENT_CREATE,
      payload,
      { delay },
    );

    return successResponse(announcement, 'Announcement created successfully');
  }
}
