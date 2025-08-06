import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { SurveyResponseService } from '../services/survey-response.service';

@ApiTags('Admin -- Survey Response')
@Controller('admin/survey-response')
@ValidateAdmin()
@ApiBearerAuth()
export class SurveyResponseController {
  constructor(private readonly surveyResponseService: SurveyResponseService) {}

  @ApiOperation({
    summary:
      'Get all user responses combined as analysis for a specific survey',
  })
  @Get(':surveyId')
  async getASurveyResponseByAllEmployees(
    @Param('surveyId') responseId: string,
  ) {
    // This method should return all responses for a specific survey
    return this.surveyResponseService.getASurveyResponseByAllEmployees(
      responseId,
    );
  }

  @ApiOperation({
    summary: 'Get all recent survey responses for all employees',
  })
  @Get('recent')
  async getAllRecentSurveyAllEmployees(@Query() pg: PaginationDto) {
    // This method should return the most recent response for a specific survey by a user
    return this.surveyResponseService.getAllRecentSurveyAllEmployees(pg);
  }

  @ApiOperation({ summary: 'Get all recent question responses by all users' })
  @Get('recent-questions')
  async getAllRecentQuestionsResponsesByAllUsers(@Query() pg: PaginationDto) {
    // This method should return the most recent responses for all questions in a specific survey
    return this.surveyResponseService.getAllRecentQuestionsResponsesByAllUsers(
      pg,
    );
  }
}
