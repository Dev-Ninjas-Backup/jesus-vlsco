import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import {
  GetSurveyQuestionsDto,
  QuestionSourceType,
} from '../dto/get-question.dto';
import {
  QuestionDto,
  UpdateQuestionDto
} from '../dto/question.dto';

@Injectable()
export class SurveyQuestionService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllSurveyQuestions(
    dto: GetSurveyQuestionsDto,
  ): Promise<TPaginatedResponse<any>> {
    const { page = 1, limit = 10, targetType, targetId } = dto;

    const whereClause =
      targetType === QuestionSourceType.SURVEY
        ? { surveyId: targetId }
        : { surveyTemplateId: targetId };

    const [questions, totalCount] = await this.prisma.$transaction([
      this.prisma.surveyQuestions.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          options: true,
          answers: true,
        },
      }),
      this.prisma.surveyQuestions.count({
        where: whereClause,
      }),
    ]);

    return successPaginatedResponse(
      questions,
      totalCount,
      page,
      limit,
      `All Questions of the ${targetType === 'survey' ? 'Survey' : 'Survey Template'}`,
    );
  }

  async getAQuestion(id: string): Promise<TResponse<any>> {
    const question = await this.prisma.surveyQuestions.findUnique({
      where: { id },
      include: { options: true },
    });

    if (!question) {
      throw new AppError(404, 'Question not found');
    }

    return successResponse(question, 'Question found successfully');
  }

  async createQuestion(
    targetId: string,
    targetType: 'survey' | 'surveyTemplate',
    dto: QuestionDto,
  ) {
    const question = await this.prisma.surveyQuestions.create({
      data: {
        surveyId: targetType === 'survey' ? targetId : null,
        surveyTemplateId: targetType === 'surveyTemplate' ? targetId : null,
        question: dto.question,
        description: dto.description,
        type: dto.type,
        order: dto.order,
        isRequired: dto.isRequired,
        captureLocation: dto.captureLocation,
        multiSelect: dto.multiSelect,
        rangeStart: dto.rangeStart,
        rangeEnd: dto.rangeEnd,
        options: dto.options?.length
          ? {
            create: dto.options.map((o) => ({
              text: o,
            })),
          }
          : undefined,
      },
      include: {
        options: true,
      },
    });

    return successResponse(question, 'Question created successfully');
  }

  async updateQuestion(id: string, dto: UpdateQuestionDto) {
    const question = await this.prisma.surveyQuestions.update({
      where: { id },
      data: {
        question: dto.question,
        description: dto.description,
        type: dto.type,
        order: dto.order,
        isRequired: dto.isRequired,
        captureLocation: dto.captureLocation,
        multiSelect: dto.multiSelect,
        rangeStart: dto.rangeStart,
        rangeEnd: dto.rangeEnd,
        options: dto.options?.length
          ? {
            create: dto.options.map((o) => ({
              text: o,
            })),
          }
          : undefined,
      },
      include: {
        options: true,
      },
    });

    return successResponse(question, 'Question updated successfully');
  }
}
