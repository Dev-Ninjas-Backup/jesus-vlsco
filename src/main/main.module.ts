import { Module } from '@nestjs/common';
import { ShiftModule } from './admin/shift/shift.module';
import { SurveyModule } from './admin/survey/survey.module';
import { UserModule } from './admin/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './admin/project/project.module';

@Module({
  imports: [AuthModule, UserModule, SurveyModule, ShiftModule, ProjectModule],
})
export class MainModule {}
