import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { CreateTeamDto } from '../dto/team.dto';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  // ================ Team CRUD ================
  @HandleError('Failed to create team')
  async createATeam(
    dto: CreateTeamDto,
    creatorId: string,
    uploadedUrl: string,
  ): Promise<TResponse<any>> {
    if (!uploadedUrl) {
      throw new AppError(500, 'File is Required');
    }

    const { title, description, department, members } = dto;

    // 1. Create the team
    const team = await this.prisma.team.create({
      data: {
        title,
        description,
        department,
        image: uploadedUrl,
        creator: { connect: { id: creatorId } },
      },
    });
    // console.log(team);

    // 2. Add members to the TeamMembers table
    const uniqueMembers = [...new Set(members ?? [])];

    await this.prisma.teamMembers.createMany({
      data: uniqueMembers.map((userId) => ({ teamId: team.id, userId })),
    });

    // // 3. Fetch the team with related data
    const fullTeam = await this.prisma.team.findUnique({
      where: { id: team.id },
      include: {
        members: { include: { user: true } },
        creator: true,
      },
    });

    return successResponse(fullTeam, 'Team added successfully');
  }

  @HandleError('Failed to delete team')
  async deleteATeam(id: string): Promise<TResponse<any>> {
    await this.utils.ensureTeamExists(id);

    const team = await this.prisma.team.delete({
      where: { id },
    });

    return successResponse(team, 'Team deleted successfully');
  }

  @HandleError('Failed to get team')
  async getATeam(id: string): Promise<TResponse<any>> {
    await this.utils.ensureTeamExists(id);

    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: true },
        },
        projects: {
          include: { projectUsers: { include: { user: true } } },
        },
      },
    });

    return successResponse(team, 'Team found successfully');
  }

  async getTeamProjects(teamId: string): Promise<TResponse<any>> {
    await this.utils.ensureTeamExists(teamId);

    const teamProjects = await this.prisma.project.findMany({
      where: { teamId },
    });

    return successResponse(teamProjects, 'Team found successfully');
  }

  // ================ Team Members ================
  @HandleError('Failed to add member to team')
  async addMemberToTeam(
    teamId: string,
    userId: string,
  ): Promise<TResponse<any>> {
    await this.utils.ensureTeamExists(teamId);
    await this.utils.ensureUserExists(userId);

    const team = await this.prisma.teamMembers.create({
      data: { teamId, userId },
    });

    return successResponse(team, 'Member added to team successfully');
  }

  @HandleError('Failed to add members to team')
  async addMembersToTeam(
    teamId: string,
    userIds: string[],
  ): Promise<TResponse<any>> {
    await this.utils.ensureTeamExists(teamId);
    await this.utils.ensureUsersExists(userIds);

    const uniqueIds = this.utils.removeDuplicateIds(userIds);

    const team = await this.prisma.teamMembers.createMany({
      data: uniqueIds.map((userId) => ({ teamId, userId })),
    });

    return successResponse(team, 'Members added to team successfully');
  }

  @HandleError('Failed to get team members')
  async getTeamMembers(teamId: string): Promise<TResponse<any>> {
    await this.utils.ensureTeamExists(teamId);

    const teamMembers = await this.prisma.teamMembers.findMany({
      where: { teamId },
      include: {
        user: {
          include: {
            profile: true,
            educations: true,
            experience: true,
            payroll: true,
            projects: true,
            shift: true,
          },
        },
      },
    });

    return successResponse(teamMembers, 'Team members found successfully');
  }

  @HandleError('Failed to add admin to team')
  async addAdminToTeam(
    teamId: string,
    userId: string,
  ): Promise<TResponse<any>> {
    await this.utils.ensureTeamExists(teamId);
    await this.utils.ensureUserExists(userId);

    const team = await this.prisma.teamMembers.create({
      data: { teamId, userId, isAdmin: true },
    });

    return successResponse(team, 'Admin added to team successfully');
  }

  @HandleError('Failed to get team admins')
  async getTeamAdminsOfATeam(teamId: string): Promise<TResponse<any>> {
    await this.utils.ensureTeamExists(teamId);

    const teamAdmins = await this.prisma.teamMembers.findMany({
      where: { teamId, isAdmin: true },
      include: { user: true },
    });

    return successResponse(teamAdmins, 'Team admins found successfully');
  }

  @HandleError('Failed to convert user to admin')
  async convertUserToAdmin(
    teamId: string,
    userId: string,
  ): Promise<TResponse<any>> {
    await this.utils.ensureTeamExists(teamId);
    await this.utils.ensureUserExists(userId);

    await this.utils.ensureMemberExistsInTeam(teamId, userId);

    const team = await this.prisma.teamMembers.update({
      where: { teamId_userId: { teamId, userId } },
      data: { isAdmin: true },
    });

    return successResponse(team, 'User made admin successfully');
  }

  @HandleError('Failed to convert admin to user')
  async convertAdminToUser(
    teamId: string,
    userId: string,
  ): Promise<TResponse<any>> {
    await this.utils.ensureTeamExists(teamId);
    await this.utils.ensureUserExists(userId);

    await this.utils.ensureMemberExistsInTeam(teamId, userId);

    const team = await this.prisma.teamMembers.update({
      where: { teamId_userId: { teamId, userId } },
      data: { isAdmin: false },
    });

    return successResponse(team, 'Admin made user successfully');
  }

  @HandleError('Failed to remove member from team')
  async removeMemberFromTeam(
    teamId: string,
    userId: string,
  ): Promise<TResponse<any>> {
    await this.utils.ensureTeamExists(teamId);
    await this.utils.ensureUserExists(userId);

    await this.utils.ensureMemberExistsInTeam(teamId, userId);

    const team = await this.prisma.teamMembers.delete({
      where: { teamId_userId: { teamId, userId } },
    });

    return successResponse(team, 'User removed from team successfully');
  }
}
