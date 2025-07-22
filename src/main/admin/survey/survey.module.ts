import { Module } from '@nestjs/common';
import { SurveyTemplateController } from './controller/survey-template.controller';
import { SurveyController } from './controller/survey.controller';
import { SurveyService } from './services/survey.service';
import { SurveyTemplateService } from './services/survey-template.service';
import { SurveyQuestionService } from './services/survey-question.service';
import { SurveyQuestionController } from './controller/survey-question.controller';
import { SurveyAssignService } from './services/survey-assign.service';
import { SurveyAssignController } from './controller/survey-assign.controller';

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
