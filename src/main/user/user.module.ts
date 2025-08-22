import { Module } from '@nestjs/common';
import { AnnouncementModule } from './announcement/announcement.module';
import { EmployeeModule } from './employee/employee.module';
import { ProjectModule } from './project/project.module';
import { RecognitionModule } from './recognition/recognition.module';
import { SurveyModule } from './survey/survey.module';
import { TimeoffRequestModule } from './time-off-request/timeoff-request.module';
import { UserTimeClickModule } from './user-time-click/user-time-click.module';

@Module({
  imports: [
    TimeoffRequestModule,
    SurveyModule,
    EmployeeModule,
    AnnouncementModule,
    ProjectModule,
    RecognitionModule,
    UserTimeClickModule,
  ],
})
export class UserModule { }
