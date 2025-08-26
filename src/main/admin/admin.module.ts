import { Module } from '@nestjs/common';
import { AnnouncementModule } from './announcement/announcement.module';
import { ManageAdminModule } from './manage-admin/manage-admin.module';
import { PoolModule } from './pool/pool.module';
import { ProjectModule } from './project/project.module';
import { RecognitionModule } from './recognition/recognition.module';
import { SettingsModule } from './settings/settings.module';
import { ShiftModule } from './shift/shift.module';
import { SurveyModule } from './survey/survey.module';
import { TaskModule } from './task/task.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { TimeClockModule } from './time-clock/time-clock.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ManageAdminModule,
    UserModule,
    SettingsModule,
    RecognitionModule,
    TeamModule,
    ProjectModule,
    ShiftModule,
    TaskModule,
    SurveyModule,
    AnnouncementModule,
    PoolModule,
    TimeClockModule,
    DashboardModule,
  ],
  providers: [],
})
export class AdminModule {}
