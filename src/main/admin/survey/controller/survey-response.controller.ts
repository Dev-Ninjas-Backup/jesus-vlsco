import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { GetSurveyResponseService } from '../services/get-survey-response.service';
import { SurveyResponseService } from '../services/survey-response.service';

@ApiTags('Admin -- Survey')
@Controller('admin/survey-response')
@ValidateAdmin()
@ApiBearerAuth()
export class SurveyResponseController {
  constructor(
    private readonly surveyResponseService: SurveyResponseService,
    private readonly getSurveyResponseService: GetSurveyResponseService,
  ) {}

  @ApiOperation({
    summary:
      'Get all user responses combined as analysis for a specific survey',
  })
  @Get(':surveyId')
  async getASurveyResponseByAllEmployees(
    @Param('surveyId') responseId: string,
  ) {
    return this.surveyResponseService.getASurveyResponseByAllEmployees(
      responseId,
    );
  }

  @ApiOperation({
    summary: 'Get all recent survey responses for all employees',
  })
  @Get('recent')
  async getAllRecentSurveyAllEmployees(@Query() pg: PaginationDto) {
    return this.surveyResponseService.getAllRecentSurveyAllEmployees(pg);
  }

  @ApiOperation({ summary: 'Get all recent question responses by all users' })
  @Get('questions/recent')
  async getAllRecentQuestionsResponsesByAllUsers(@Query() pg: PaginationDto) {
    return this.surveyResponseService.getAllRecentQuestionsResponsesByAllUsers(
      pg,
    );
  }

  @ApiOperation({ summary: 'Get all responses for a specific survey' })
  @Get('responses/analytics')
  async getAllResponses() {
    // This method should return all responses for a specific survey
    return this.getSurveyResponseService.getSurveyRespondUserAnalytics();
  }
}
