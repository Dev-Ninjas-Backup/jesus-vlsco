import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateAnnouncementDto } from '../dto/createAnnouncement.dto';

@Injectable()
export class CreateAnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
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

    return successResponse(announcement, 'Announcement created successfully');
  }
}
