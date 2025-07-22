import { Injectable } from '@nestjs/common';
import { successResponse, TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateSurveyTemplateDto } from '../dto/survey-template.dto';

@Injectable()
export class SurveyTemplateService {
  constructor(private readonly prisma: PrismaService) { }

  async createSurveyTemplate(dto: CreateSurveyTemplateDto): Promise<TResponse<any>> {
    const surveyTemplate = await this.prisma.surveyTemplate.create({
      data: {
        title: dto.title,
        description: dto.description,
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
              }
            })
          })),
        },
      },
    });


    return successResponse(surveyTemplate, 'Survey Template added successfully');
  }

  async getAllSurveyTemplate() { }

  async getSurveyTemplate() { }

  async updateSurveyTemplate() { }

  async deleteSurveyTemplate() { }
}
