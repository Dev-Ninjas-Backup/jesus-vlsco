import { Injectable } from '@nestjs/common';
import { TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class AnnouncementService {
  constructor(private readonly prisma: PrismaService) { }

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
}
