import { Module } from '@nestjs/common';
import { TeamController } from './controller/team.controller';
import { TeamService } from './services/team.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
