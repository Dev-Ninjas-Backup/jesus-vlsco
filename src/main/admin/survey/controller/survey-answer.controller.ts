import { Body, Controller, Post, Req } from '@nestjs/common';
import { SurveyAnswerService } from '../services/survey-answer.service';
import { SubmitQuestionAnswerDto } from '../dto/survey-answer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';

@ApiTags('Admin -- Survey Question')
@Controller('admin/survey-answer')
@ValidateAdmin()
@ApiBearerAuth()
export class SurveyAnswerController {

    constructor(private readonly surveyAnswerService: SurveyAnswerService) {}
    @Post('submit')
    async submitQuestionAnswer(@Body() dto: SubmitQuestionAnswerDto, @GetUser('userId') userId: string, ) {
        return this.surveyAnswerService.submitQuestionAnswer(userId,dto)
    }
}
