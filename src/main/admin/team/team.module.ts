import { Module } from '@nestjs/common';
import { TeamController } from './controller/team.controller';
import { TeamService } from './services/team.service';
import { GetAllTeamsService } from './services/get-all-team.service';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { UpdateTeamService } from './services/update-team.service';

@Module({
  controllers: [TeamController],
  providers: [
    TeamService,
    GetAllTeamsService,
    CloudinaryService,
    UpdateTeamService,
  ],
})
export class TeamModule {}
