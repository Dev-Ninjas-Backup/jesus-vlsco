import { Module } from '@nestjs/common';
import { SurveyAnswerController } from './controller/survey-answer.controller';
import { SurveyResponseController } from './controller/survey-response.controller';
import { SurveyController } from './controller/survey.controller';
import { SurveyResponseService } from './services/survey-response.service';
import { SurveyService } from './services/survey.service';
import { SurveyAnswerService } from './services/survey-answer.service';

@Module({
  controllers: [
    SurveyController,
    SurveyAnswerController,
    SurveyResponseController,
  ],
  providers: [SurveyService, SurveyAnswerService, SurveyResponseService],
})
export class SurveyModule {}
