import { Injectable } from '@nestjs/common';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';

@Injectable()
export class SurveyAssignService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilsService: UtilsService,
  ) { }

  async assignUsersToASurvey(
    userIds: string[],
    surveyId: string,
  ): Promise<TResponse<any>> {
    await this.utilsService.ensureUsersExists(userIds);

    const uniqueIds = this.utilsService.removeDuplicateIds(userIds);

    const surveyUsers = await this.prismaService.surveyUser.createMany({
      data: uniqueIds.map((userId) => ({ userId, surveyId })),
    });

    return successResponse(surveyUsers, 'Users assigned successfully');
  }

  async removeUsersFromASurvey(
    userIds: string[],
    surveyId: string,
  ): Promise<TResponse<any>> {
    await this.utilsService.ensureUsersExists(userIds);

    const uniqueIds = this.utilsService.removeDuplicateIds(userIds);

    const surveyUsers = await this.prismaService.surveyUser.deleteMany({
      where: {
        surveyId,
        userId: { in: uniqueIds },
      },
    });

    return successResponse(surveyUsers, 'Users removed successfully');
  }

  async assignTeamToASurvey(
    teamIds: string[],
    surveyId: string,
  ): Promise<TResponse<any>> {
    const uniqueIds = this.utilsService.removeDuplicateIds(teamIds);

    const surveyTeams = await this.prismaService.teamSurvey.createMany({
      data: uniqueIds.map((teamId) => ({ teamId, surveyId })),
    });

    return successResponse(surveyTeams, 'Teams assigned successfully');
  }

  async removeTeamFromASurvey(
    teamIds: string[],
    surveyId: string,
  ): Promise<TResponse<any>> {
    const uniqueIds = this.utilsService.removeDuplicateIds(teamIds);

    const surveyTeams = await this.prismaService.teamSurvey.deleteMany({
      where: {
        surveyId,
        teamId: { in: uniqueIds },
      },
    });

    return successResponse(surveyTeams, 'Teams removed successfully');
  }

  async getAllAssignedUsersOfASurvey(surveyId: string): Promise<TResponse<any>> {
    // Users directly assigned to the survey
    const surveyUsers = await this.prismaService.surveyUser.findMany({
      where: { surveyId },
      include: { user: true },
    });

    // Users assigned via team assignments
    const usersInAssignedTeams = await this.prismaService.teamSurvey.findMany({
      where: { surveyId },
      include: {
        team: {
          include: {
            members: {
              include: { user: true },
            },
          },
        },
      },
    });

    const usersFromUserTableBasedOnTeamsAndSurvey =
      usersInAssignedTeams.flatMap((teamSurvey) =>
        teamSurvey.team.members.map((member) => member.user),
      );

    // Merge both sources and deduplicate by user ID
    const allUsersMap = new Map<string, any>();

    for (const su of surveyUsers) {
      allUsersMap.set(su.user.id, su.user);
    }

    for (const user of usersFromUserTableBasedOnTeamsAndSurvey) {
      allUsersMap.set(user.id, user);
    }

    const allUsers = Array.from(allUsersMap.values());

    return successResponse(allUsers, 'Users found successfully');
  }
}
