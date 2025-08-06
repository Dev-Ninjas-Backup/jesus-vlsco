import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { successResponse, TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class SurveyResponseService {
  constructor(private readonly prisma: PrismaService) { }

  async getASurveyResponseByAllEmployees(surveyId: string): Promise<TResponse> {
    return successResponse(
      null,
      'Successfully retrieved survey responses',
    )
  }

  async getAllRecentSurveyAllEmployees(pg: PaginationDto): Promise<TResponse> {
    const page = pg.page || 1;
    const limit = pg.limit || 10;

    // * get the ids based on pagination

    // * get the most recent response for each user by the `getASurveyResponseByAllEmployees`

    return successResponse(
      null,
      'Successfully retrieved recent survey responses for all employees',
    );
  }

  async getAllRecentQuestionsResponsesByAllUsers(pg: PaginationDto): Promise<TResponse> {
    return successResponse(
      null,
      'Successfully retrieved recent question responses for all users',
    );
  }
}
