import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { CreateSurveyFromTemplateDto } from '../dto/create-survey-from-template.dto';
import { CreateSurveyDto, UpdateSurveyDto } from '../dto/survey.dto';

@Injectable()
export class SurveyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  async createSurvey(
    userId: string,
    dto: CreateSurveyDto,
  ): Promise<TResponse<any>> {
    const survey = await this.prisma.survey.create({
      data: {
        ...dto,
        createdBy: userId,
        questions: {
          create: dto.questions.map((q) => ({
            question: q.question,
            description: q.description,
            type: q.type,
            order: q.order,
            isRequired: q.isRequired,
            captureLocation: q.captureLocation,
            multiSelect: q.multiSelect,
            rangeStart: q.rangeStart,
            rangeEnd: q.rangeEnd,
            ...(q.options && {
              options: {
                create: q.options.map((o) => ({
                  text: o,
                })),
              },
            }),
          })),
        },
      },
    });

    return successResponse(survey, 'Survey created successfully');
  }

  async createSurveyFromTemplate(
    userId: string,
    templateId: string,
    dto: CreateSurveyFromTemplateDto,
  ): Promise<TResponse<any>> {
    return this.prisma.$transaction(async (tx) => {
      console.log('templateId', templateId);
      //  Get template with questions and options
      const template = await tx.surveyTemplate.findUnique({
        where: { id: templateId },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      });

      if (!template) {
        throw new AppError(404, 'Template not found');
      }

      // Create survey based on template
      const survey = await tx.survey.create({
        data: {
          title: dto.title || template.title,
          description: dto.description || template.description,
          surveyType: dto.surveyType || 'EmployeeSatisfaction',
          status: dto.status || 'DRAFT',
          publishTime: dto.publishTime ? new Date(dto.publishTime) : null,
          reminderTime: dto.reminderTime ? new Date(dto.reminderTime) : null,
          showOnFeed: dto.showOnFeed ?? false,
          templateId,
          createdBy: userId,
        },
      });

      // Clone questions and their options into this survey (Updating surveyId will not worked)
      for (const q of template.questions) {
        await tx.surveyQuestions.create({
          data: {
            question: q.question,
            description: q.description,
            type: q.type,
            order: q.order,
            isRequired: q.isRequired,
            captureLocation: q.captureLocation,
            multiSelect: q.multiSelect,
            rangeStart: q.rangeStart,
            rangeEnd: q.rangeEnd,
            surveyId: survey.id,
            options: q.options?.length
              ? {
                  create: q.options.map((o) => ({
                    text: o.text,
                  })),
                }
              : undefined,
          },
        });
      }

      return successResponse(survey, 'Survey created from template');
    });
  }

  async getAllSurveys() {}

  async getSurvey(id: string): Promise<TResponse<any>> {
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

  async deleteSurvey(id: string): Promise<TResponse<any>> {
    await this.utils.ensureSurveyExists(id);

    const result = await this.prisma.survey.delete({
      where: { id },
    });

    return successResponse(result, 'Survey deleted successfully');
  }

  async updateSurvey(id: string, dto: UpdateSurveyDto) {
    await this.utils.ensureSurveyExists(id);
    const survey = await this.prisma.survey.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        surveyType: dto.surveyType,
        status: dto.status,
        publishTime: dto.publishTime ? new Date(dto.publishTime) : null,
        reminderTime: dto.reminderTime ? new Date(dto.reminderTime) : null,
        showOnFeed: dto.showOnFeed ?? false,
      },
    });
    return successResponse(survey, 'Survey updated successfully');
  }
}
