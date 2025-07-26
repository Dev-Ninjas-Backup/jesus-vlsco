import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { CreateTeamDto, UpdateTeamDto } from '../dto/team.dto';

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
    const team = await this.prisma.team.create({
      data: {
        title: dto.title,
        description: dto.description,
        department: dto.department,
        image: uploadedUrl,
        creatorId,
        members: {
          create:
            dto.members?.map((userId) => ({
              user: {
                connect: { id: userId },
              },
            })) || [],
        },
      },
      include: {
        members: {
          include: { user: true },
        },
      },
    });

    return successResponse(team, 'Team added successfully');
  }

  @HandleError('Failed to update team')
  async updateATeam(id: string, dto: UpdateTeamDto): Promise<TResponse<any>> {
    await this.utils.ensureTeamExists(id);

    // Start transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Update the basic team fields
      const team = await tx.team.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          department: dto.department,
        },
      });

      // 2. If members provided, reset and reassign them
      if (dto.members && dto.members.length > 0) {
        // Remove existing members
        await tx.teamMembers.deleteMany({
          where: { teamId: id },
        });

        // Add new members
        await tx.teamMembers.createMany({
          data: dto.members.map((userId) => ({
            teamId: id,
            userId,
          })),
          skipDuplicates: true,
        });
      }

      return team;
    });

    return successResponse(result, 'Team updated successfully');
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
      include: { user: true },
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
