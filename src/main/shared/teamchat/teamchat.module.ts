import { Module } from '@nestjs/common';
import { TeamController } from './teamchat.controller';
import { TeamchatService } from './teamchat.service';
import { FileService } from '@project/lib/utils/file.service';
@Module({
  controllers: [TeamController],
  providers: [TeamchatService, FileService],
})
export class TeamchatModule {}
