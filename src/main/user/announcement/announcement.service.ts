import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class AnnouncementService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to fetch announcements')
  async getAssignedAnnouncements(userId: string): Promise<TResponse<any>> {
    // Get all team IDs the user belongs to
    const teamMemberships = await this.prisma.teamMembers.findMany({
      where: { userId },
      select: { teamId: true },
    });

    const teamIds = teamMemberships.map((tm) => tm.teamId);

    // Fetch both assigned team announcements AND public announcements
    const announcements = await this.prisma.announcement.findMany({
      where: {
        OR: [
          {
            isForAllUsers: true,
          },
          {
            teamAnnouncements: {
              some: {
                teamId: {
                  in: teamIds.length > 0 ? teamIds : [''], // * empty fallback to prevent invalid SQL
                },
              },
            },
          },
        ],
      },
      include: {
        attachments: true,
        likedUser: true,
        category: true,
        author: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                profileUrl: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: 'Announcements fetched successfully',
      data: announcements,
    };
  }

  @HandleError('Failed to fetch announcement')
  async getSingleAnnouncement(announcementId: string): Promise<TResponse<any>> {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id: announcementId },
      include: {
        attachments: true,
        likedUser: true,
        category: true,
        author: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                profileUrl: true,
              },
            },
          },
        },
      },
    });

    return {
      success: true,
      message: 'Announcement fetched successfully',
      data: announcement,
    };
  }

  @HandleError('Failed to like announcement')
  async likeAnnouncement(
    userId: string,
    announcementId: string,
  ): Promise<TResponse<any>> {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id: announcementId },
    });

    if (!announcement) {
      throw new AppError(404, 'Announcement not found');
    }

    const existingLike = await this.prisma.announcementReactedUser.findFirst({
      where: {
        announcementId,
        userId,
      },
    });

    if (existingLike) {
      throw new AppError(400, 'You have already liked this announcement');
    }

    const like = await this.prisma.announcementReactedUser.create({
      data: {
        announcementId,
        userId,
      },
    });
    // * increase like count
    await this.prisma.announcement.update({
      where: { id: announcementId },
      data: {
        likeCount: {
          increment: 1,
        },
        viewCount: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
      message: 'Announcement liked successfully',
      data: like,
    };
  }
}
