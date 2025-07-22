import { Injectable } from '@nestjs/common';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import {
  CreateSurveyTemplateDto,
  GetAllSurveyTemplateDto,
  UpdateSurveyTemplateDto,
} from '../dto/survey-template.dto';

@Injectable()
export class SurveyTemplateService {
  constructor(private readonly prisma: PrismaService) { }

  async createSurveyTemplate(
    dto: CreateSurveyTemplateDto,
  ): Promise<TResponse<any>> {
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
              },
            }),
          })),
        },
      },
    });

    return successResponse(
      surveyTemplate,
      'Survey Template added successfully',
    );
  }

  async getAllSurveyTemplate(
    query: GetAllSurveyTemplateDto,
  ): Promise<TPaginatedResponse<any>> {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Number(query.limit) || 10, 100); // limit max to 100
    const orderBy = query.orderBy || 'desc';
    const searchTerm = query.searchTerm?.trim();

    const where = searchTerm
      ? {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: this.prisma.utils.QueryMode.insensitive,
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: this.prisma.utils.QueryMode.insensitive,
            },
          },
        ],
      }
      : {};

    const [surveyTemplates, totalCount] = await this.prisma.$transaction([
      this.prisma.surveyTemplate.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: orderBy },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
          surveys: true,
        }
      }),
      this.prisma.surveyTemplate.count({ where }),
    ]);

    return successPaginatedResponse(
      surveyTemplates,
      page,
      limit,
      totalCount,
      'Survey Templates found successfully',
    );
  }

  async getSurveyTemplate(id: string): Promise<TResponse<any>> {
    const surveyTemplate = await this.prisma.surveyTemplate.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
        surveys: true,
      }
    });

    if (!surveyTemplate) {
      throw new Error('Survey Template not found');
    }

    return successResponse(surveyTemplate, 'Survey Template found successfully');
  }

  async updateSurveyTemplate(id: string, dto: UpdateSurveyTemplateDto): Promise<TResponse<any>> {
    const surveyTemplate = await this.prisma.surveyTemplate.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
      },
    });

    return successResponse(
      surveyTemplate,
      'Survey Template updated successfully',
    );
  }

  async deleteSurveyTemplate(id: string): Promise<TResponse<any>> {
    const result = await this.prisma.$transaction(async (tx) => {
      // Delete the survey template first
      const surveyTemplate = await tx.surveyTemplate.delete({
        where: { id },
      });

      // Delete questions that are only attached to this template (not used in any survey)
      await tx.surveyQuestions.deleteMany({
        where: {
          surveyTemplateId: id,
          surveyId: null,
        },
      });

      // For questions that are linked to both the template and a survey, remove the template link
      await tx.surveyQuestions.updateMany({
        where: {
          surveyTemplateId: id,
        },
        data: {
          surveyTemplateId: null,
        },
      });

      return surveyTemplate;
    });

    return successResponse(result, 'Survey Template deleted successfully');
  }

}
