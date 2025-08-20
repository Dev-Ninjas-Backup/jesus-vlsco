import { Module } from '@nestjs/common';
import { UserTimeClickService } from './user-time-click.service';
import { UserTimeClickController } from './user-time-click.controller';

@Module({
  controllers: [UserTimeClickController],
  providers: [UserTimeClickService],
})
export class UserTimeClickModule {}
