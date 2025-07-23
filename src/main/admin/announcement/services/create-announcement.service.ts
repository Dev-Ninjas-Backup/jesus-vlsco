import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
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
        ...(data.teams && {
          teamAnnouncements: {
            createMany: {
              data: data.teams.map((teamId) => ({ teamId })),
            },
          },
        }),
      },
    });

    const recipients = await this.resolveRecipients(
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

  private async resolveRecipients(
    isForAllUsers: boolean,
    teamIds?: string[],
  ): Promise<string[]> {
    if (isForAllUsers) {
      const users = await this.prisma.user.findMany({ select: { id: true } });
      return users.map((u) => u.id);
    }
    if (teamIds && teamIds.length) {
      const members = await this.prisma.teamMembers.findMany({
        where: { teamId: { in: teamIds } },
        select: { userId: true },
      });
      return Array.from(new Set(members.map((m) => m.userId)));
    }
    return [];
  }
}
