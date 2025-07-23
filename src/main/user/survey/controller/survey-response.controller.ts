import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { SubmitSurveyResponseDto } from '../dto/survey-response.dto';
import { SurveyResponseService } from '../services/survey-response.service';

@ApiTags('Employee -- Survey Response')
@Controller('employee/survey-response')
@ValidateEmployee()
@ApiBearerAuth()
export class SurveyResponseController {
  constructor(private surveyResponseService: SurveyResponseService) {}

  @Post('submit/:surveyId')
  async submitResponse(
    @GetUser('userId') userId: string,
    @Param('surveyId') surveyId: string,
    @Body() dto: SubmitSurveyResponseDto,
  ) {
    return this.surveyResponseService.submitSurveyResponse(
      userId,
      surveyId,
      dto,
    );
  }

  @Get('all')
  async getAllResponsesByAEmployee(
    @GetUser('userId') userId: string,
    @Query() query: PaginationDto,
  ) {
    return this.surveyResponseService.getAllResponsesByAEmployee(userId, query);
  }

  @Get(':id')
  async getSingleResponse(
    @GetUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.surveyResponseService.getSingleResponse(userId, id);
  }
}
