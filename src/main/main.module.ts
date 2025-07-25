import { Module } from '@nestjs/common';
import { NotificationModule } from '../lib/notification/notification.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    UserModule,
    NotificationModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
