import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetAssignedSurveyDto } from '../dto/get-assigned-survey.dto';

@Injectable()
export class SurveyService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get all assigned surveys')
  async getAllAssignedSurveys(
    userId: string,
    query: GetAssignedSurveyDto,
  ): Promise<TResponse<any>> {
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
          include: {
            options: true,
          },
        },
        user: {
          include: {
            profile: true,
          },
        },
        surveyUsers: {
          where: {
            userId,
          },
          select: {
            isResponded: true,
          },
        },
      },
    });

    // Map isResponded to the top-level of each survey
    const surveysWithResponse = surveys.map((survey) => ({
      ...survey,
      isResponded: survey.surveyUsers[0]?.isResponded ?? false,
      surveyUsers: undefined, // remove nested if not needed
    }));

    return successResponse(
      surveysWithResponse,
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
