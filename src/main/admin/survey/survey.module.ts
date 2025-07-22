import { Module } from '@nestjs/common';
import { SurveyTemplateController } from './controller/survey-template.controller';
import { SurveyController } from './controller/survey.controller';
import { SurveyService } from './services/survey.service';
import { SurveyTemplateService } from './services/survey-template.service';

@Module({
  controllers: [SurveyTemplateController, SurveyController],
  providers: [SurveyService, SurveyTemplateService]
})
export class SurveyModule { }
