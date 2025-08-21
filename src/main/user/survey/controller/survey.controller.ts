import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { SurveyService } from '../services/survey.service';

@ApiTags('Employee -- Survey & Pool')
@Controller('employee/survey')
@ValidateEmployee()
@ApiBearerAuth()
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Get('assigned')
  async getAllAssignedSurveys(
    @GetUser('userId') userId: string,
    @Query() query: PaginationDto,
  ) {
    return await this.surveyService.getAllAssignedSurveys(userId, query);
  }

  @Get(':id/assigned')
  async getSingleSurvey(@Param('id') id: string) {
    return await this.surveyService.getSingleSurvey(id);
  }
}
