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

    const teamIds = teamMemberships.map(tm => tm.teamId);

    if (teamIds.length === 0) {
      return {
        success: true,
        message: 'No assigned teams found for this user.',
        data: [],
      };
    }

    // Get announcements assigned to those teams
    const announcements = await this.prisma.announcement.findMany({
      where: {
        teamAnnouncements: {
          some: {
            teamId: { in: teamIds },
          },
        },
      },
      include: {
        attachments: true,
        likedUser: true,
        category: true,
        author: {
          select: { id: true, email: true },
        },
      },
    });
    // // * get announcements with isForAllUsers set to true
    // const announcements = await this.prisma.announcement.findMany({
    //   where: {
    //     isForAllUsers: true,
    //   },
    //   include: {
    //     attachments: true,
    //     likedUser: true,
    //     category: true,
    //     author: {
    //       select: { id: true, email: true },
    //     },
    //   },
    // })

    return {
      success: true,
      message: 'Announcements fetched successfully',
      data: announcements,
    };
  }

}

