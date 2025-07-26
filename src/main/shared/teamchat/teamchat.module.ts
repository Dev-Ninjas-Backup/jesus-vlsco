import { Module } from '@nestjs/common';
import { TeamController } from './teamchat.controller';
import { TeamchatService } from './teamchat.service';

@Module({
  controllers: [TeamController]                                                                                                                                                                                                                      Controller],
  providers: [TeamchatService]
})
export class TeamchatModule {}
