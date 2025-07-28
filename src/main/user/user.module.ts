import { Module } from '@nestjs/common';
import { SurveyModule } from './survey/survey.module';
import { TimeoffRequestModule } from './time-off-request/timeoff-request.module';
import { EmployeeModule } from './employee/employee.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { ProjectModule } from './project/project.module';
import { ShiftModule } from './shift/shift.module';

@Module({
  imports: [
    TimeoffRequestModule,
    SurveyModule,
    EmployeeModule,
    AnnouncementModule,
    ProjectModule,
    ShiftModule,
  ],
})
export class UserModule {}
