import { Module } from '@nestjs/common';
import { SurveyModule } from './survey/survey.module';
import { TimeoffRequestModule } from './time-off-request/timeoff-request.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [TimeoffRequestModule, SurveyModule, EmployeeModule],
})
export class UserModule {}
