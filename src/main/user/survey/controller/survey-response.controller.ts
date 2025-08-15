import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateEmployee } from '@project/common/jwt/jwt.decorator';
import { SubmitSurveyResponseDto } from '../dto/survey-response.dto';
import { SurveyResponseService } from '../services/survey-response.service';

@ApiTags('Employee -- Survey & Pool')
@Controller('employee/survey')
@ValidateEmployee()
@ApiBearerAuth()
export class SurveyResponseController {
  constructor(private surveyResponseService: SurveyResponseService) {}

  @Post(':surveyId/response')
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

  // @Get('responses')
  // async getAllResponsesByAEmployee(
  //   @GetUser('userId') userId: string,
  //   @Query() query: PaginationDto,
  // ) {
  //   return this.surveyResponseService.getAllResponsesByAEmployee(userId, query);
  // }

  // @Get('response/:id')
  // async getSingleResponse(
  //   @GetUser('userId') userId: string,
  //   @Param('id') id: string,
  // ) {
  //   return this.surveyResponseService.getSingleResponse(userId, id);
  // }
}
