import { Module } from '@nestjs/common';
import { TimeoffRequestModule } from './time-off-request/timeoff-request.module';
import { SurveyModule } from './survey/survey.module';

@Module({
  imports: [TimeoffRequestModule, SurveyModule],
})
export class UserModule {}
