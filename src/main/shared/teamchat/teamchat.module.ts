import { Module } from '@nestjs/common';
import { TeamController } from './teamchat.controller';
import { TeamchatService } from './teamchat.service';
import { TeamGateway } from './teamGateway/teamgeteway';
import { FileService } from '@project/lib/file/file.service';
@Module({
  controllers: [TeamController],
  providers: [TeamchatService, FileService, TeamGateway],
})
export class TeamchatModule {}
