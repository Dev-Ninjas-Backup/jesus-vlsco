import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [AuthModule, AdminModule, UserModule, NotificationModule, SharedModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
