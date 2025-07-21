import { Module } from '@nestjs/common';
import { AnnouncementModule } from './admin/announcement/announcement.module';
import { ProjectModule } from './admin/project/project.module';
import { RecognitionModule } from './admin/recognition/recognition.module';
import { SettingsModule } from './admin/settings/settings.module';
import { ShiftModule } from './admin/shift/shift.module';
import { SurveyModule } from './admin/survey/survey.module';
import { TaskModule } from './admin/task/task.module';
import { TeamModule } from './admin/team/team.module';
import { UserModule } from './admin/user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RecognitionModule,
    ShiftModule,
    TeamModule,
    ProjectModule,
    TaskModule,
    SurveyModule,
    AnnouncementModule,
    SettingsModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule { }
