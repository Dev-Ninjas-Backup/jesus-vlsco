import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import {
  CreateQuestionTargetDto,
  GetSurveyQuestionsDto,
} from '../dto/get-question.dto';
import { QuestionDto, UpdateQuestionDto } from '../dto/question.dto';
import { SurveyQuestionService } from '../services/survey-question.service';

@ApiTags('Admin -- Survey Question')
@Controller('admin/survey-question')
@ValidateAdmin()
@ApiBearerAuth()
export class SurveyQuestionController {
  constructor(private readonly surveyQuestionService: SurveyQuestionService) {}

  @Get()
  getAllSurveyQuestions(@Query() dto: GetSurveyQuestionsDto) {
    return this.surveyQuestionService.getAllSurveyQuestions(dto);
  }

  @Get(':id')
  getAQuestion(@Param('id') id: string) {
    return this.surveyQuestionService.getAQuestion(id);
  }

  @Post('create/:targetId')
  createQuestion(
    @Param('targetId') targetId: string,
    @Query() data: CreateQuestionTargetDto,
    @Body() dto: QuestionDto,
  ) {
    return this.surveyQuestionService.createQuestion(
      targetId,
      data.targetType,
      dto,
    );
  }

  @Patch('update/:id')
  updateQuestion(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
    return this.surveyQuestionService.updateQuestion(id, dto);
  }

  @Patch('delete/:id')
  deleteQuestion(@Param('id') id: string) {
    return this.surveyQuestionService.deleteQuestion(id);
  }
}
