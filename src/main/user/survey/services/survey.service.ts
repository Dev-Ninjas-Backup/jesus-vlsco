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
    const searchTerm = query.searchTerm?.trim();

    const surveys = await this.prisma.survey.findMany({
      where: {
        surveyUsers: {
          some: {
            userId,
          },
        },
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return successResponse(surveys, 'Assigned Surveys found successfully');
  }

  @HandleError('Failed to get single survey')
  async getSingleSurvey(id: string): Promise<TResponse<any>> {
    const survey = await this.prisma.survey.findUnique({
      where: { id, surveyUsers: { some: { isResponded: false } } },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!survey) {
      throw new AppError(403, 'Survey not found or already responded');
    }

    return successResponse(survey, 'Survey found successfully');
  }
}
