import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateTeamDto } from '../dto/team.dto';

@Injectable()
export class UpdateTeamService {
  constructor(private readonly prisma: PrismaService) {}
  @HandleError('Failed to update team')
  async updateATeam(id: string, dto: UpdateTeamDto): Promise<TResponse<any>> {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!team) {
      throw new AppError(404, 'Team not found');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Update basic fields
      await tx.team.update({
        where: { id },
        data: {
          ...(dto.title?.trim() && { title: dto.title }),
          ...(dto.description?.trim() && { description: dto.description }),
          ...(dto.department?.trim() && { department: dto.department }),
        },
      });

      // 2. Update members if provided
      if (dto.members) {
        const uniqueMembers = [...new Set(dto.members)];
        const existingMembers = team.members.map((m) => m.userId);

        const newMembers = uniqueMembers.filter(
          (m) => !existingMembers.includes(m),
        );
        const removedMembers = existingMembers.filter(
          (m) => !uniqueMembers.includes(m),
        );

        if (removedMembers.length > 0) {
          await tx.teamMembers.deleteMany({
            where: { teamId: id, userId: { in: removedMembers } },
          });
        }

        if (newMembers.length > 0) {
          // * Create new members in the TeamMembers table
          await tx.teamMembers.createMany({
            data: newMembers.map((userId) => ({ teamId: id, userId })),
          });
          // * Get all the projects with this team id
          const projects = await tx.project.findMany({
            where: { teamId: id },
          });
          // * Add the new members to all the projects
          await tx.projectUser.createMany({
            data: projects.flatMap((project) =>
              newMembers.map((userId) => ({
                projectId: project.id,
                userId,
              })),
            ),
          });
        }
      }

      // 3. Return fully updated team
      return tx.team.findUnique({
        where: { id },
        include: { members: true },
      });
    });

    return successResponse(result, 'Team updated successfully');
  }
}
