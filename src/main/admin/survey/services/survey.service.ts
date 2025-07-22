import { Injectable } from '@nestjs/common';
import { successResponse, TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';

@Injectable()
export class SurveyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) { }

  async createSurvey(userId: string, dto: any): Promise<TResponse<any>> {
    const survey = await this.prisma.survey.create({
      data: {
        ...dto,
        createdBy: userId
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
