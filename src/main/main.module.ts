import { Module } from '@nestjs/common';
import { ProjectModule } from './admin/project/project.module';
import { RecognitionModule } from './admin/recognition/recognition.module';
import { ShiftModule } from './admin/shift/shift.module';
import { SurveyModule } from './admin/survey/survey.module';
import { TaskModule } from './admin/task/task.module';
import { UserModule } from './admin/user/user.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './admin/team/team.module';
import { SettingsModule } from './admin/settings/settings.module';
import { AnnouncementModule } from './admin/announcement/announcement.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RecognitionModule,
    ShiftModule,
    TeamModule,
    ProjectModule,
    TaskModule,
    AnnouncementModule,
    SettingsModule,
    SurveyModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
