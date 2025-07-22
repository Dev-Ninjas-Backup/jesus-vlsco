import { Module } from '@nestjs/common';
import { SurveyTemplateController } from './controller/survey-template.controller';
import { SurveyController } from './controller/survey.controller';
import { SurveyService } from './services/survey.service';
import { SurveyTemplateService } from './services/survey-template.service';
import { SurveyQuestionService } from './services/survey-question.service';
import { SurveyQuestionController } from './controller/survey-question.controller';

@Module({
  controllers: [
    SurveyTemplateController,
    SurveyController,
    SurveyQuestionController,
  ],
  providers: [SurveyService, SurveyTemplateService, SurveyQuestionService],
})
export class SurveyModule {}
