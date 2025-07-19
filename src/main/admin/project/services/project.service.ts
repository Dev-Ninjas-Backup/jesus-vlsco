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
  constructor(private readonly prisma: PrismaService) { }

  // ========== CREATE ==========
  @HandleError('Failed to create project')
  async createProject(dto: CreateProjectDto): Promise<TResponse<any>> {
    const project = await this.prisma.project.create({
      data: { ...dto },
    });

    return successResponse(project, 'Project added successfully');
  }

  // ========== ASSIGN EMPLOYEE ==========
  @HandleError('Failed to assign project')
  async assignProjectToEmployee(projectId: string, userId: string) {
    await this.ensureProjectExists(projectId);
    await this.ensureUserExists(userId);

    const already = await this.prisma.projectUser.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });
    if (already) throw new AppError(400, 'Project already assigned');

    const projectUser = await this.prisma.projectUser.create({
      data: { projectId, userId },
    });

    return successResponse(projectUser, 'Project assigned successfully');
  }

  // ========== ASSIGN MULTI EMPLOYEE ==========
  @HandleError('Failed to assign project to employees')
  async assignProjectToEmployees(projectId: string, userIds: string[]) {
    await this.ensureProjectExists(projectId);

    const uniqueIds = this.removeDuplicateIds(userIds);
    await this.ensureUsersExists(uniqueIds);

    const projectUser = await this.prisma.projectUser.createMany({
      data: uniqueIds.map((userId) => ({ projectId, userId })),
    });

    return successResponse(projectUser, 'Project assigned successfully');
  }

  // ========== ASSIGN OR SET NEW TEAM  ==========
  @HandleError('Failed to set project team')
  async setProjectTeam(projectId: string, teamId: string) {
    const project = await this.ensureProjectExists(projectId);
    await this.ensureTeamExists(teamId);

    if (project.teamId === teamId) {
      throw new AppError(400, 'Project already assigned to this team');
    }

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        team: { connect: { id: teamId } },
      },
    });

    return successResponse(updatedProject, 'Project team set successfully');
  }

  // ========== REMOVE TEAM ==========
  @HandleError('Failed to remove project team')
  async removeProjectTeam(projectId: string) {
    const project = await this.ensureProjectExists(projectId);

    if (!project.teamId) {
      throw new AppError(400, 'Project has no team assigned');
    }

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        team: { disconnect: true },
      },
    });

    return successResponse(
      updatedProject,
      'Project team removed successfully',
    );
  }

  // ========== ASSIGN MANAGER ==========
  @HandleError('Failed to assign project')
  async assignProjectToManager(projectId: string, managerId: string) {
    const project = await this.ensureProjectExists(projectId);
    await this.ensureUserExists(managerId);

    if (project.managerId === managerId) {
      throw new AppError(400, 'Project already assigned to this manager');
    }

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        manager: { connect: { id: managerId } },
      },
    });

    return successResponse(
      updatedProject,
      'Project assigned to manager successfully',
    );
  }

  // ========== UPDATE MANAGER ==========
  @HandleError('Failed to update project manager')
  async updateProjectManager(projectId: string, managerId: string) {
    const project = await this.ensureProjectExists(projectId);
    await this.ensureUserExists(managerId);

    if (project.managerId === managerId) {
      throw new AppError(400, 'Project already assigned to this manager');
    }

    const updatedProject = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        manager: { connect: { id: managerId } },
      },
    });

    return successResponse(
      updatedProject,
      'Project manager updated successfully',
    );
  }

  // ========== GET SINGLE PROJECT ==========
  @HandleError('Failed to get project')
  async getAProject(id: string): Promise<TResponse<any>> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        team: true,
        manager: true,
        projectUsers: {
          include: { user: true },
        },
        tasks: {
          include: { tasksUsers: { include: { user: true } } },
        },
      },
    });

    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    return successResponse(project, 'Project found successfully');
  }

  // ========== DELETE A PROJECT ==========
  @HandleError('Failed to delete project')
  async deleteProject(id: string): Promise<TResponse<any>> {
    await this.ensureProjectExists(id);

    const project = await this.prisma.project.delete({
      where: { id },
    });

    return successResponse(project, 'Project deleted successfully');
  }

  // ========== PRIVATE HELPERS ==========
  private async ensureProjectExists(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new AppError(404, 'Project not found');
    return project;
  }

  private async ensureUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }

  private async ensureUsersExists(userIds: string[]) {
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });
    if (users.length !== userIds.length)
      throw new AppError(404, 'User not found');
    return users;
  }

  private async ensureTeamExists(teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!team) throw new AppError(404, 'Team not found');
    return team;
  }

  private removeDuplicateIds(ids: string[]) {
    return Array.from(new Set(ids));
  }
}
