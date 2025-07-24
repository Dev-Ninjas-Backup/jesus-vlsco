import { Module } from '@nestjs/common';
import { SurveyModule } from './survey/survey.module';
import { TimeoffRequestModule } from './time-off-request/timeoff-request.module';
import { EmployeeModule } from './employee/employee.module';
import { AnnouncementModule } from './announcement/announcement.module';

@Module({
  imports: [TimeoffRequestModule, SurveyModule, EmployeeModule, AnnouncementModule],
})
export class UserModule {}
