import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NotificationSettingModule } from './notification-setting/notification-setting.module';
import { TeamchatModule } from './teamchat/teamchat.module';

@Module({
  imports: [AuthModule, NotificationSettingModule, TeamchatModule],
})
export class SharedModule {}
