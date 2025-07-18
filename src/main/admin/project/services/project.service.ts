import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateProjectDto } from '../dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to create project')
  async createProject(dto: CreateProjectDto): Promise<TResponse<any>> {
    const project = await this.prisma.project.create({
      data: {
        ...dto,
      },
    });

    return successResponse(project, 'Project added successfully');
  }

  @HandleError('Failed to assign project')
  async assignProjectToEmployee(projectId: string, userId: string) {
    // 1. Check project
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    // 2. Check user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // 3. Check if already assigned (to prevent unique‐constraint errors)
    const already = await this.prisma.projectUser.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
    if (already) {
      throw new AppError(400, 'Project already assigned');
    }

    // 4. Finally, create the join record
    const projectUser = await this.prisma.projectUser.create({
      data: { projectId, userId },
    });

    return successResponse(projectUser, 'Project assigned successfully');
  }

  @HandleError('Failed to assign project')
  async assignProjectToTeam(projectId: string, teamId: string) {
    // 1. Check project
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    // 2. Check team
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!team) {
      throw new AppError(404, 'Team not found');
    }

    // 3. Check if already assigned (to prevent unique‐constraint errors)
    const already = await this.prisma.project.findUnique({
      where: {
        id: projectId,
        teamId: teamId,
      },
    });
    if (already) {
      throw new AppError(400, 'Project already assigned');
    }

    const updatedProject = await this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        team: {
          connect: {
            id: teamId,
          },
        },
      },
    });
    return successResponse(updatedProject, 'Project assigned successfully');
  }

  @HandleError('Failed to assign project')
  async assignProjectToManager(projectId: string, managerId: string) {
    // 1. Check project
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    // 2. Check manager
    const manager = await this.prisma.user.findUnique({
      where: { id: managerId },
    });
    if (!manager) {
      throw new AppError(404, 'Manager not found');
    }

    // 3. Check if already assigned (to prevent unique‐constraint errors)
    const already = await this.prisma.project.findUnique({
      where: {
        id: projectId,
        managerId: managerId,
      },
    });
    if (already) {
      throw new AppError(400, 'Project already assigned');
    }

    const updatedProject = await this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        manager: {
          connect: {
            id: managerId,
          },
        },
      },
    });
    return successResponse(updatedProject, 'Project assigned successfully');
  }
}
