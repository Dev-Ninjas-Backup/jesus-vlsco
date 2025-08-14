import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { ManageProjectDto } from '../dto/manage-project.dto';

@Injectable()
export class ManageProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to manage projects')
  async manageProjects(dto: ManageProjectDto): Promise<TResponse> {
    return await this.prisma.$transaction(async (tx) => {
      // Step 1: Collect DTO project IDs (only for updates)
      const dtoProjectIds =
        dto.projects?.map((p) => p.id).filter((id) => id !== undefined) ?? [];

      // Step 2: Delete projects not included in DTO
      await tx.project.deleteMany({
        where: {
          id: { notIn: dtoProjectIds },
        },
      });

      // Step 3: Upsert projects
      if (dto.projects?.length) {
        for (const project of dto.projects) {
          const { id, ...projectData } = project;

          if (id) {
            // Validate project exists
            const existingProject = await tx.project.findUnique({
              where: { id },
            });
            if (!existingProject) {
              throw new AppError(404, `Project with ID ${id} not found`);
            }

            await tx.project.update({
              where: { id },
              data: projectData,
            });
          } else {
            // Create new project
            const createdProject = await tx.project.create({
              data: {
                teamId: projectData.teamId,
                managerId: projectData.managerId ?? '',
                title: projectData.title ?? '',
                projectLocation: projectData.projectLocation ?? '',
              },
            });

            // If teamId provided, assign all team members to the project
            if (projectData.teamId) {
              const team = await tx.team.findUnique({
                where: { id: projectData.teamId },
                include: { members: true },
              });

              if (!team) {
                throw new AppError(
                  404,
                  `Team with ID ${projectData.teamId} not found`,
                );
              }

              await tx.projectUser.createMany({
                data: team.members.map((member) => ({
                  projectId: createdProject.id,
                  userId: member.userId,
                })),
              });
            }
          }
        }
      }

      // Step 5: Fetch final updated projects list
      const finalProjects = await tx.project.findMany({
        include: {
          projectUsers: {
            include: { user: true },
          },
        },
      });

      return successResponse(finalProjects, 'Projects managed successfully');
    });
  }
}
