import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { EVENT_TYPES } from '@project/common/interface/events-name';
import { AnnouncementEvent } from '@project/common/interface/events-payload';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { CreateAnnouncementDto } from '../dto/createAnnouncement.dto';

@Injectable()
export class CreateAnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Creates a new announcement and schedules it for processing.
   * @param data - The announcement data.
   * @param urls - Array of file URLs to attach to the announcement.
   * @param userId - ID of the user creating the announcement.
   * @returns A success response with the created announcement.
   */
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
          createMany: { data: urls.map((file) => ({ file })) },
        },
      },
    });

    const members = await this.prisma.teamMembers.findMany({
      where: {
        teamId: { in: data.teams },
      },
    });

    const recipients = await this.utils.resolveRecipients(
      data.isForAllUsers || false,
      members.map((m) => m.teamId),
    );

    // Minimal payload
    const payload: AnnouncementEvent = {
      action: 'CREATE',
      info: {
        title: announcement.title,
        message: announcement.description as string,
        sendEmail: announcement.sendEmailNotification,
        recipients,
      },
      meta: {
        announcementId: announcement.id,
        performedBy: userId,
        publishedAt: announcement.publishedNow
          ? new Date()
          : announcement.publishedAt!,
      },
    };

    // Emit an event; CompanyEventService will queue and broadcast
    this.eventEmitter.emit(EVENT_TYPES.COMPANY_ANNOUNCEMENT_CREATE, payload);

    return successResponse(announcement, 'Announcement created successfully');
  }
}
