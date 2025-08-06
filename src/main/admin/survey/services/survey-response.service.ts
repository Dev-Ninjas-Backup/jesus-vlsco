import { Injectable } from '@nestjs/common';
import { SurveyStatus } from '@prisma/client';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

type DashboardQuestionResponse = {
  id: string;
  question: string;
  type: 'SELECT' | 'RANGE' | 'OPEN_ENDED';
  surveyTitle: string;
  status: SurveyStatus;
  responses: number;
  distribution?: { label: string; value: number; count: number }[];
  sampleAnswers?: string[];
};

@Injectable()
export class SurveyResponseService {
  constructor(private readonly prisma: PrismaService) { }

  async getASurveyResponseByAllEmployees(surveyId: string): Promise<TResponse> {
    const responses = await this.prisma.surveyResponse.findMany({
      where: { surveyId },
      include: {
        answers: {
          include: {
            question: {
              select: {
                id: true,
                question: true,
                type: true,
              },
            },
            selectedOptions: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    return successResponse(
      responses,
      'Successfully retrieved survey responses',
    );
  }

  async getAllRecentSurveyAllEmployees(pg: PaginationDto): Promise<TResponse> {
    const page = pg.page || 1;
    const limit = pg.limit || 10;

    // * get the ids based on pagination
    const offset = (page - 1) * limit;

    const responses = await this.prisma.surveyResponse.findMany({
      select: {
        id: true,
        surveyId: true,
        userId: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    // * get the most recent response for each user by the `getASurveyResponseByAllEmployees`
    const surveyIds = responses.map((r) => r.surveyId);

    const recentResponses = await Promise.all(
      surveyIds.map((surveyId) =>
        this.getASurveyResponseByAllEmployees(surveyId),
      ),
    );

    return successResponse(
      recentResponses,
      'Successfully retrieved recent survey responses for all employees',
    );
  }

  async getAllRecentQuestionsResponsesByAllUsers(
    pg: PaginationDto,
  ): Promise<TResponse> {
    const page = pg.page || 1;
    const limit = pg.limit || 10;
    const offset = (page - 1) * limit;

    const questions = await this.prisma.surveyQuestions.findMany({
      where: {
        surveyId: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      include: {
        survey: true,
        options: true,
      },
    });

    const results: DashboardQuestionResponse[] = [];

    for (const question of questions) {
      const base = {
        id: question.id,
        question: question.question,
        type: question.type,
        surveyTitle: question.survey?.title || 'Untitled',
        status: question.survey?.status || 'DRAFT',
        responses: 0,
      };

      if (question.type === 'SELECT') {
        // SELECT type — count by options (multi/single handled by answerOptions)
        const answers = await this.prisma.surveyAnswerOption.groupBy({
          by: ['optionId'],
          where: {
            answer: {
              questionId: question.id,
            },
          },
          _count: true,
        });

        const totalCount = answers.reduce((sum, a) => sum + a._count, 0);

        const optionMap = new Map(
          question.options.map((opt) => [opt.id, opt.text]),
        );

        results.push({
          ...base,
          responses: totalCount,
          distribution: answers.map((a) => ({
            label: optionMap.get(a.optionId) || 'Unknown',
            count: a._count,
            value: a._count / totalCount,
          })),
        });
      } else if (question.type === 'RANGE') {
        // RANGE type — group by rate field
        const ratings = await this.prisma.surveyAnswer.groupBy({
          by: ['rate'],
          where: {
            questionId: question.id,
            rate: { not: null },
          },
          _count: true,
        });

        const totalCount = ratings.reduce((sum, r) => sum + r._count, 0);

        results.push({
          ...base,
          responses: totalCount,
          distribution: ratings.map((r) => ({
            label: `${r.rate}`,
            count: r._count,
            value: r._count / totalCount,
          })),
        });
      } else if (question.type === 'OPEN_ENDED') {
        const answers = await this.prisma.surveyAnswer.findMany({
          where: {
            questionId: question.id,
            answerText: { not: null },
          },
          select: { answerText: true },
        });

        const count = await this.prisma.surveyAnswer.count({
          where: {
            questionId: question.id,
            answerText: { not: null },
          },
        });

        results.push({
          ...base,
          responses: count,
          sampleAnswers: answers.map((a) => a.answerText ?? ''),
        });
      }
    }

    return successResponse(
      {
        rawAnswers: questions,
        analyticsAnswer: results,
      },
      'Successfully retrieved recent question responses for all users',
    );
  }
}
