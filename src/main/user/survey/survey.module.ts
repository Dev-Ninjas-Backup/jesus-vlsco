import { Module } from '@nestjs/common';
import { SurveyResponseController } from './controller/survey-response.controller';
import { SurveyController } from './controller/survey.controller';
import { SurveyResponseService } from './services/survey-response.service';
import { SurveyService } from './services/survey.service';
import { PoolService } from './services/pool.service';
import { PoolController } from './controller/pool.controller';

@Module({
  controllers: [SurveyController, SurveyResponseController, PoolController],
  providers: [SurveyService, SurveyResponseService, PoolService],
})
export class SurveyModule {}
