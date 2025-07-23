import { Module } from '@nestjs/common';
import { SurveyTemplateController } from './controller/survey-template.controller';
import { SurveyController } from './controller/survey.controller';
import { SurveyService } from './services/survey.service';
import { SurveyTemplateService } from './services/survey-template.service';
import { SurveyQuestionService } from './services/survey-question.service';
import { SurveyQuestionController } from './controller/survey-question.controller';
import { SurveyAssignService } from './services/survey-assign.service';
import { SurveyAssignController } from './controller/survey-assign.controller';
import { SurveyAnswerController } from './controller/survey-answer.controller';
import { SurveyAnswerService } from './services/survey-answer.service';

@Module({
  controllers: [
    SurveyTemplateController,
    SurveyController,
    SurveyQuestionController,
    SurveyAssignController,
    SurveyAnswerController,
  ],
  providers: [
    SurveyService,
    SurveyTemplateService,
    SurveyQuestionService,
    SurveyAssignService,
    SurveyAnswerService,
  ],
})
export class SurveyModule {}
