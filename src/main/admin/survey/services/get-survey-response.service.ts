import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class GetSurveyResponseService {
  constructor(private readonly prisma: PrismaService) { }

  @HandleError('Failed to get responses')
  async getAllResponses(
    query: PaginationDto,
  ): Promise<TPaginatedResponse<any>> {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Number(query.limit) || 10, 100);

    const [responses, totalCount] = await this.prisma.$transaction([
      this.prisma.surveyResponse.findMany({
        include: {
          survey: {
            include: {
              questions: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.surveyResponse.count(),
    ]);

    return successPaginatedResponse(
      responses,
      { page, limit, total: totalCount },
      'Responses retrieved successfully',
    );
  }

  @HandleError('Failed to get single response')
  async getSingleResponse(id: string): Promise<TResponse<any>> {
    const response = await this.prisma.surveyResponse.findUnique({
      where: { id },
      include: { survey: true },
    });

    return successResponse(response, 'Response retrieved successfully');
  }

  @HandleError('Failed to get survey response analytics')
  async getSurveyRespondUserAnalytics(): Promise<TResponse<any>> {
    const surveys = await this.prisma.survey.findMany({
      include: {
        surveyUsers: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    const analytics = surveys.map((survey) => {
      const totalAssigned = survey.surveyUsers.length;
      const respondedCount = survey.surveyUsers.filter(
        (su) => su.isResponded,
      ).length;
      const notRespondedCount = totalAssigned - respondedCount;

      return {
        ...survey,
        createdBy: survey.user,
        surveyId: survey.id,
        title: survey.title,
        totalAssigned,
        respondedCount,
        notRespondedCount,
        respondedUsers: survey.surveyUsers
          .filter((su) => su.isResponded)
          .map((su) => su.user),
        notRespondedUsers: survey.surveyUsers
          .filter((su) => !su.isResponded)
          .map((su) => su.user),
      };
    });

    return successResponse(
      analytics,
      'Survey response analytics retrieved successfully',
    );
  }
}
