import { Injectable } from '@nestjs/common';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class GetShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAssignedUsersOfAProjects(
    projectId: string,
  ): Promise<TResponse<any>> {
    const projectUsers = await this.prisma.projectUser.findMany({
      where: { projectId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!projectUsers) {
      return successResponse([], 'No project users found');
    }

    // * get all shifts for this project
    const shifts = await this.prisma.shift.findMany({
      where: { projectId },
      include: {
        users: {
          include: {
            profile: true,
          },
        },
      },
    });

    return successResponse(
      {
        projectUsers,
        shifts,
      },
      'Team found successfully',
    );
  }
}
