import { Module } from '@nestjs/common';
import { CreateTeamChatController } from './controller/create-team-chat.controller';
import { CreateTeamChatService } from './services/create-team-chat.service';

@Module({
  controllers: [CreateTeamChatController],
  providers: [CreateTeamChatService]
})
export class TeamChatModule {}
