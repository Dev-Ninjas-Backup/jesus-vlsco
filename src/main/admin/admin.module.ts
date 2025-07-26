import { Module } from '@nestjs/common';
import { AnnouncementModule } from './announcement/announcement.module';
import { ProjectModule } from './project/project.module';
import { RecognitionModule } from './recognition/recognition.module';
import { SettingsModule } from './settings/settings.module';
import { ShiftModule } from './shift/shift.module';
import { SurveyModule } from './survey/survey.module';
import { TaskModule } from './task/task.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    RecognitionModule,
    ShiftModule,
    TeamModule,
    ProjectModule,
    TaskModule,
    SurveyModule,
    AnnouncementModule,
    SettingsModule
  ],
})
export class AdminModule {}
