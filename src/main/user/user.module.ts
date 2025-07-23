import { Module } from '@nestjs/common';
import { TimeoffRequestModule } from './time-off-request/timeoff-request.module';

@Module({
  imports: [TimeoffRequestModule],
})
export class UserModule {}
