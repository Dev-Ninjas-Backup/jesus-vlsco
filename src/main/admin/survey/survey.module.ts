import { Module } from '@nestjs/common';
import { SurveyResponseService } from '@project/main/user/survey/services/survey-response.service';
import { SurveyAssignController } from './controller/survey-assign.controller';
import { SurveyQuestionController } from './controller/survey-question.controller';
import { SurveyTemplateController } from './controller/survey-template.controller';
import { SurveyController } from './controller/survey.controller';
import { SurveyAssignService } from './services/survey-assign.service';
import { SurveyQuestionService } from './services/survey-question.service';
import { SurveyTemplateService } from './services/survey-template.service';
import { SurveyService } from './services/survey.service';
import { GetSurveyResponseService } from './services/get-survey-response.service';

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
    SurveyResponseService,
    GetSurveyResponseService,
  ],
})
export class SurveyModule {}
