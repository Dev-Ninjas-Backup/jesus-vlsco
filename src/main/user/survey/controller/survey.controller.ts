import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { GetAssignedSurveyDto } from '../dto/get-assigned-survey.dto';
import { SurveyService } from '../services/survey.service';

@ApiTags('Employee -- Survey')
@Controller('employee/survey')
@ValidateEmployee()
@ApiBearerAuth()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get('assigned')
  async getAllAssignedSurveys(
    @GetUser('userId') userId: string,
    @Query() query: GetAssignedSurveyDto,
  ) {
    return await this.surveyService.getAllAssignedSurveys(userId, query);
  }
}
