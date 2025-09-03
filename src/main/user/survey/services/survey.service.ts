import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class SurveyService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get all assigned surveys')
  async getAllAssignedSurveys(
    userId: string,
    query: PaginationDto,
  ): Promise<TPaginatedResponse<any>> {
    const page = query.page || 1;
    const limit = query.limit && query.limit >= 0 ? query.limit : 5;

    // Fetch surveys assigned to the user
    const surveys = await this.prisma.survey.findMany({
      where: {
        OR: [{ surveyUsers: { some: { userId } } }, { isForAll: true }],
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        questions: {
          include: { options: true },
        },
        user: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get all responses for these surveys at once
    const surveyIds = surveys.map((s) => s.id);
    const responded = await this.prisma.surveyUser.findMany({
      where: {
        userId,
        surveyId: { in: surveyIds },
        isResponded: true,
      },
      select: { surveyId: true },
    });

    // Create a quick lookup for responded surveys
    const respondedSet = new Set(responded.map((r) => r.surveyId));

    // Attach isResponded dynamically
    const surveysWithResponse = surveys.map((survey) => ({
      ...survey,
      isResponded: respondedSet.has(survey.id),
      surveyUsers: undefined, // remove nested if not needed
    }));

    return successPaginatedResponse(
      surveysWithResponse,
      {
        page,
        limit,
        total: await this.prisma.survey.count({
          where: {
            OR: [{ surveyUsers: { some: { userId } } }, { isForAll: true }],
          },
        }),
      },
      'Assigned Surveys found successfully',
    );
  }

  @HandleError('Failed to get single survey')
  async getSingleSurvey(id: string): Promise<TResponse<any>> {
    const survey = await this.prisma.survey.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!survey) {
      throw new AppError(404, 'Survey not found');
    }

    return successResponse(survey, 'Survey found successfully');
  }
}
