import { Module } from '@nestjs/common';
import { TeamController } from './teamchat.controller';
import { TeamchatService } from './teamchat.service';
@Module({
  controllers: [TeamController],
  providers: [TeamchatService],
})
export class TeamchatModule {}
