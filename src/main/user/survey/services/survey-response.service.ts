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
import { SubmitSurveyResponseDto } from '../dto/survey-response.dto';

@Injectable()
export class SurveyResponseService {
  constructor(private readonly prisma: PrismaService) { }

  @HandleError('Failed to submit survey response')
  async submitSurveyResponse(
    userId: string,
    surveyId: string,
    dto: SubmitSurveyResponseDto,
  ): Promise<TResponse<any>> {
    const { answers } = dto;

    return await this.prisma.$transaction(async (tx) => {
      // 1. Check survey exists & is active
      const survey = await tx.survey.findUnique({
        where: { id: surveyId },
        include: { surveyUsers: true },
      });
      if (!survey || survey.status === 'COMPLETED') {
        throw new AppError(404, 'Survey not found or not active');
      }

      // 2. Check user is assigned
      const assigned = survey.surveyUsers.find((su) => su.userId === userId);
      if (!assigned) {
        throw new AppError(400, 'You are not assigned to this survey');
      }
      if (assigned.isResponded) {
        throw new AppError(400, 'You have already responded');
      }

      // 3. Create the response record
      const response = await tx.surveyResponse.create({
        data: {
          surveyId,
          userId,
          submittedAt: new Date(),
        },
      });

      // 4. Build and insert answers
      for (const ans of answers) {
        // (Optional) validate question belongs to this survey
        const q = await tx.surveyQuestions.findUnique({
          where: { id: ans.questionId },
        });
        if (!q || q.surveyId !== surveyId) {
          throw new AppError(400, `Invalid question ${ans.questionId}`);
        }

        // 4a. Create answer
        const createdAns = await tx.surveyAnswer.create({
          data: {
            responseId: response.id,
            questionId: ans.questionId,
            answerText: ans.answerText,
            rate: ans.rate,
          },
        });

        // 4b. If multi‑select/single‑select, insert option links
        if (ans.options?.length) {
          await tx.surveyAnswerOption.createMany({
            data: ans.options.map((o) => ({
              answerId: createdAns.id,
              optionId: o.optionId,
            })),
          });
        }
      }

      // 5. Mark user responded
      await tx.surveyUser.update({
        where: { userId_surveyId: { userId, surveyId } },
        data: { isResponded: true },
      });

      return successResponse(response, 'Survey submitted successfully');
    });
  }

  async getAllResponsesByAEmployee(userId: string, query: PaginationDto): Promise<TPaginatedResponse<any>> {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Number(query.limit) || 10, 100);

    const [responses, totalCount] = await this.prisma.$transaction([
      this.prisma.surveyResponse.findMany({
        where: { userId },
        include: {
          survey: {
            include: {
              questions: {
                include: {
                  options: true,
                },
              },
              responses: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.surveyResponse.count({ where: { userId } }),
    ])

    return successPaginatedResponse(responses, { page, limit, total: totalCount }, 'Responses retrieved successfully');
  }
}
