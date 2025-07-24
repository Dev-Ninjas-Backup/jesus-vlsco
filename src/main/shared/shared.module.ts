import { Module } from '@nestjs/common';
import { NotificationSettingModule } from './notification-setting/notification-setting.module';

@Module({
  imports: [NotificationSettingModule]
})
export class SharedModule {}
