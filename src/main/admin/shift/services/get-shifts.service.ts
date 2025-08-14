import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
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
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new AppError(404, 'Project not found');

    const teamWithUsers = await this.prisma.team.findUnique({
      where: { id: project.teamId as any },
      include: {
        members: {
          include: {
            user: {
              include: {
                profile: true,
                payroll: true,
                shift: true,
                taskUsers: true,
              },
            },
          },
        },
      },
    });

    return successResponse(teamWithUsers, 'Team found successfully');
  }
}
