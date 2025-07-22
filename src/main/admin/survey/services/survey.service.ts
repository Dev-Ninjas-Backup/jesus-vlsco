import { Injectable } from '@nestjs/common';
import { successResponse, TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { CreateSurveyDto } from '../dto/survey.dto';

@Injectable()
export class SurveyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) { }

  async createSurvey(userId: string, dto: CreateSurveyDto): Promise<TResponse<any>> {
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
        }
      }
    })

    return successResponse(survey, 'Survey created successfully');
  }

  async createSurveyFromTemplate(userId: string, dto: any) { }

  async getAllSurveys() { }

  async getSurvey(id: string) { }

  async deleteSurvey(id: string) { }

  async updateSurvey(id: string, dto: any) { }
}
