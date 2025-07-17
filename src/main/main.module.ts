import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './admin/user/user.module';
import { SurveyModule } from './admin/survey/survey.module';

@Module({
  imports: [AuthModule, UserModule, SurveyModule],
})
export class MainModule {}
