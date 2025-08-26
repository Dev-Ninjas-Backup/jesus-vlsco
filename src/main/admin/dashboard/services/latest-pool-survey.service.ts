import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class LatestPoolSurveyService {
  constructor(private prisma: PrismaService) {}

  @HandleError('Failed to get analytics')
  async getLatestSurveyPoolResponseAnalytics(): Promise<TResponse<any>> {
    const surveyAnalytics = await this.getLatestSurveyResponseAnalytics();
    const poolAnalytics = await this.getLatestPoolResponse();

    const analytics = {
      survey: surveyAnalytics,
      pool: poolAnalytics,
    };

    return successResponse(analytics, 'Analytics retrieved successfully');
  }

  private async getLatestSurveyResponseAnalytics() {
    // Fetch the latest survey
    const latestSurvey = await this.prisma.survey.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        surveyUsers: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
        user: {
          include: { profile: true },
        },
      },
    });

    if (!latestSurvey) {
      return null;
    }

    const totalUsers = await this.prisma.user.count();

    const surveyUsers = latestSurvey.surveyUsers;
    const totalAssigned = latestSurvey.isForAll
      ? totalUsers
      : surveyUsers.length;

    const respondedUsers = surveyUsers
      .filter((su) => su.isResponded)
      .map((su) => su.user);
    const notRespondedUsers = surveyUsers
      .filter((su) => !su.isResponded)
      .map((su) => su.user);

    const analytics = {
      surveyId: latestSurvey.id,
      title: latestSurvey.title,
      description: latestSurvey.description,
      createdBy: latestSurvey.user?.profile?.jobTitle || 'N/A',
      totalAssigned,
      respondedCount: respondedUsers.length,
      responsePercentage:
        totalAssigned > 0 ? (respondedUsers.length / totalAssigned) * 100 : 0,
      notRespondedCount: notRespondedUsers.length,
      notResponsePercentage:
        totalAssigned > 0
          ? (notRespondedUsers.length / totalAssigned) * 100
          : 0,
      respondedUsers,
      notRespondedUsers,
      createdAt: latestSurvey.createdAt,
    };

    return analytics;
  }

  private async getLatestPoolResponse() {
    const latestPool = await this.prisma.pool.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        options: {
          include: {
            poolResponse: true,
          },
        },
      },
    });

    if (!latestPool) {
      return null;
    }

    const totalResponses = latestPool.options.reduce(
      (sum, option) => sum + option.poolResponse.length,
      0,
    );

    const result = {
      id: latestPool.id,
      title: latestPool.title,
      description: latestPool.description,
      totalResponse: totalResponses,
      options: latestPool.options.map((option) => {
        const optionResponses = option.poolResponse.length;
        return {
          option: option.option,
          totalResponse: optionResponses,
          responsePercentage:
            totalResponses > 0 ? (optionResponses / totalResponses) * 100 : 0,
        };
      }),
    };

    return result;
  }
}
