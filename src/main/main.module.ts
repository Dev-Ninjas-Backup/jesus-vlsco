import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './admin/user/user.module';
import { SurveyModule } from './admin/survey/survey.module';
import { RecognitionModule } from './recognition/recognition.module';

@Module({
  imports: [AuthModule, UserModule, SurveyModule, RecognitionModule],
})
export class MainModule {}
