import { Module } from '@nestjs/common';
import { ShiftModule } from './admin/shift/shift.module';
import { SurveyModule } from './admin/survey/survey.module';
import { UserModule } from './admin/user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, UserModule, SurveyModule, ShiftModule],
})
export class MainModule {}
