import { Module } from '@nestjs/common';
import { SurveyController } from './controller/survey.controller';
import { SurveyService } from './services/survey.service';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
