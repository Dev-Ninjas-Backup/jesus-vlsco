import { Module } from '@nestjs/common';
import { SurveyAssignController } from './controller/survey-assign.controller';
import { SurveyQuestionController } from './controller/survey-question.controller';
import { SurveyTemplateController } from './controller/survey-template.controller';
import { SurveyController } from './controller/survey.controller';
import { SurveyAssignService } from './services/survey-assign.service';
import { SurveyQuestionService } from './services/survey-question.service';
import { SurveyTemplateService } from './services/survey-template.service';
import { SurveyService } from './services/survey.service';

@Module({
  controllers: [
    SurveyTemplateController,
    SurveyController,
    SurveyQuestionController,
    SurveyAssignController,
  ],
  providers: [
    SurveyService,
    SurveyTemplateService,
    SurveyQuestionService,
    SurveyAssignService,
  ],
})
export class SurveyModule {}
