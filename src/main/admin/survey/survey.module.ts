import { Module } from '@nestjs/common';
import { SurveyResponseController } from './controller/survey-response.controller';
import { SurveyTemplateController } from './controller/survey-template.controller';
import { SurveyController } from './controller/survey.controller';
import { GetSurveyResponseService } from './services/get-survey-response.service';
import { SurveyAssignService } from './services/survey-assign.service';
import { SurveyQuestionService } from './services/survey-question.service';
import { SurveyResponseService } from './services/survey-response.service';
import { SurveyTemplateService } from './services/survey-template.service';
import { SurveyService } from './services/survey.service';

@Module({
  controllers: [
    SurveyTemplateController,
    SurveyController,
    // SurveyQuestionController,
    // SurveyAssignController,
    SurveyResponseController,
  ],
  providers: [
    SurveyService,
    SurveyTemplateService,
    SurveyQuestionService,
    SurveyAssignService,
    SurveyResponseService,
    GetSurveyResponseService,
    SurveyResponseService,
  ],
})
export class SurveyModule {}
