import { Module } from '@nestjs/common';
import { ProjectModule } from './admin/project/project.module';
import { ShiftModule } from './admin/shift/shift.module';
import { SurveyModule } from './admin/survey/survey.module';
import { TaskModule } from './admin/task/task.module';
import { UserModule } from './admin/user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SurveyModule,
    ShiftModule,
    ProjectModule,
    TaskModule,
  ],
})
export class MainModule {}
