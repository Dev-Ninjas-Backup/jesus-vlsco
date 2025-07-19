import { Module } from '@nestjs/common';
import { TeamController } from './controller/team.controller';
import { TeamService } from './services/team.service';
import { GetAllTeamsService } from './services/get-all-team.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService, GetAllTeamsService],
})
export class TeamModule {}
