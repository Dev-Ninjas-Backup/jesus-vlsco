import { Module } from '@nestjs/common';
import { TeamController } from './teamchat.controller';
import { TeamchatService } from './teamchat.service';
import { FileService } from '@project/lib/utils/file.service';
import { TeamGateway } from './teamGateway/teamgeteway';
@Module({
  controllers: [TeamController],
  providers: [TeamchatService, FileService, TeamGateway],
})
export class TeamchatModule {}
