import { Module } from '@nestjs/common';
import { TeamController } from './controller/team.controller';
import { TeamService } from './services/team.service';
import { GetAllTeamsService } from './services/get-all-team.service';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService, GetAllTeamsService, CloudinaryService],
})
export class TeamModule {}
