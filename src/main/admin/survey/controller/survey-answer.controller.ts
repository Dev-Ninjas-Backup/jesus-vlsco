import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { SubmitQuestionAnswerDto } from '../dto/survey-answer.dto';
import { SurveyAnswerService } from '../services/survey-answer.service';

@ApiTags('Admin -- Survey Answer')
@Controller('admin/survey-answer')
@ValidateAdmin()
@ApiBearerAuth()
export class SurveyAnswerController {
  constructor(private readonly surveyAnswerService: SurveyAnswerService) {}
  @Post('submit')
  async submitQuestionAnswer(
    @Body() dto: SubmitQuestionAnswerDto,
    @GetUser('userId') userId: string,
  ) {
    return this.surveyAnswerService.submitQuestionAnswer(userId, dto);
  }
}
