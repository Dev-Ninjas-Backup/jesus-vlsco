import { Module } from '@nestjs/common';
import { SurveyResponseController } from './controller/survey-response.controller';
import { SurveyController } from './controller/survey.controller';
import { SurveyAnswerService } from './services/survey-answer.service';
import { SurveyResponseService } from './services/survey-response.service';
import { SurveyService } from './services/survey.service';

@Module({
  controllers: [
    SurveyController,
    // SurveyAnswerController,
    SurveyResponseController,
  ],
  providers: [SurveyService, SurveyAnswerService, SurveyResponseService],
})
export class SurveyModule {}
