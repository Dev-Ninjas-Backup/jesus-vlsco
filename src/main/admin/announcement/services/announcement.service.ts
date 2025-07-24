import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { GetAnnouncementDto } from '../dto/get-announcement.dto';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) { }

  @HandleError('Failed to get announcements')
  async getAnnouncements(
    query: GetAnnouncementDto,
  ): Promise<TPaginatedResponse<any>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const {
      teamId,
      categoryId,
      title,
      publishedNow,
      sendEmailNotification,
      enabledReadReceipt,
      isForAllUsers,
      publishedFrom,
      publishedTo,
      sortBy = 'createdAt',
      orderBy = 'desc',
    } = query;

    const where: any = {
      ...(categoryId && { categoryId }),
      ...(title && {
        title: { contains: title, mode: 'insensitive' },
      }),
      ...(typeof publishedNow === 'boolean' && { publishedNow }),
      ...(typeof sendEmailNotification === 'boolean' && {
        sendEmailNotification,
      }),
      ...(typeof enabledReadReceipt === 'boolean' && { enabledReadReceipt }),
      ...(typeof isForAllUsers === 'boolean' && { isForAllUsers }),
      ...(publishedFrom || publishedTo
        ? {
          publishedAt: {
            ...(publishedFrom && { gte: new Date(publishedFrom) }),
            ...(publishedTo && { lte: new Date(publishedTo) }),
          },
        }
        : {}),
      ...(teamId && {
        teamAnnouncements: {
          some: {
            teamId,
          },
        },
      }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.announcement.findMany({
        where,
        orderBy: {
          [sortBy]: orderBy,
        },
        skip,
        take: limit,
        include: {
          author: true,
          category: true,
          attachments: true,
          _count: {
            select: {
              likedUser: true,
            },
          },
        },
      }),
      this.prisma.announcement.count({ where }),
    ]);

    return successPaginatedResponse(
      data,
      { page, limit, total },
      'Announcements retrieved successfully',
    );
  }

  @HandleError('Failed to create announcement', 'announcement')
  async getAnnouncement(id: string): Promise<TResponse<any>> {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      throw new AppError(404, 'Announcement not found');
    }

    return successResponse(announcement, 'Announcement retrieved successfully');
  }

  @HandleError('Failed to create announcement', 'announcement')
  async deleteAnnouncement(id: string): Promise<TResponse<any>> {
    await this.prisma.announcement.delete({ where: { id } });

    return successResponse(null, 'Announcement deleted successfully');
  }

  @HandleError('Failed to get recipients of announcement')
  async getAllRecipientsOfAnnouncement(
    announcementId: string,
  ): Promise<TResponse<any>> {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id: announcementId },
      include: { teamAnnouncements: true },
    });
    if (!announcement) {
      throw new AppError(404, 'Announcement not found');
    }
    const recipients = await this.utils.resolveRecipients(
      announcement.isForAllUsers,
      announcement.teamAnnouncements.map((t) => t.teamId),
    );
    return successResponse(recipients, 'Recipients retrieved successfully');
  }
}
