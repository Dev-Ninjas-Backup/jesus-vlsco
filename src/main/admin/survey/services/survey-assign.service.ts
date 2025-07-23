import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
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
  ) {}

  @HandleError('Error assigning users to a survey')
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

  @HandleError('Error removing users from a survey')
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

  @HandleError('Error assigning teams to a survey')
  async assignTeamToASurvey(
    teamIds: string[],
    surveyId: string,
  ): Promise<TResponse<any>> {
    await this.utilsService.ensureTeamsExists(teamIds);
    const uniqueIds = this.utilsService.removeDuplicateIds(teamIds);

    const surveyTeams = await this.prismaService.teamSurvey.createMany({
      data: uniqueIds.map((teamId) => ({ teamId, surveyId })),
    });

    // * now assign users from teams to survey
    const teams = await this.prismaService.team.findMany({
      where: { id: { in: uniqueIds } },
      include: {
        members: {
          include: { user: true },
        },
      },
    });

    await this.prismaService.surveyUser.createMany({
      data: teams.flatMap((team) =>
        team.members.map((member) => ({
          userId: member.user.id,
          surveyId,
        })),
      ),
    });

    return successResponse(surveyTeams, 'Teams assigned successfully');
  }

  @HandleError('Error removing teams from a survey')
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

    // * remove users from survey
    await this.prismaService.surveyUser.deleteMany({
      where: {
        surveyId,
        userId: { in: uniqueIds },
      },
    });

    return successResponse(surveyTeams, 'Teams removed successfully');
  }

  @HandleError('Error getting all assigned users of a survey')
  async getAllAssignedUsersOfASurvey(
    surveyId: string,
  ): Promise<TResponse<any>> {
    // Users directly assigned to the survey
    const surveyUsers = await this.prismaService.surveyUser.findMany({
      where: { surveyId },
      include: { user: true },
    });

    return successResponse(surveyUsers, 'Users found successfully');
  }
}
