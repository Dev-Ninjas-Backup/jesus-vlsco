import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NotificationSettingModule } from './notification-setting/notification-setting.module';

@Module({
  imports: [AuthModule, NotificationSettingModule],
})
export class SharedModule {}
