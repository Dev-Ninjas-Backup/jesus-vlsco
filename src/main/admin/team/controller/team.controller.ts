import { Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TeamService } from '../services/team.service';

@Controller('admin/team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({ summary: 'Create a team' })
  @Post()
  async createATeam() {
    return this.teamService.createATeam();
  }
}
