import { Body, Controller, Delete, Param, Post, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateTeamDto } from '../dto/team.dto';
import { TeamService } from '../services/team.service';

@Controller('admin/team')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

  @ApiOperation({ summary: 'Create a team' })
  @Post()
  async createATeam(@Body() dto: CreateTeamDto) {
    return this.teamService.createATeam(dto);
  }

  @ApiOperation({ summary: 'Update a team' })
  @Post(':teamId')
  async updateATeam(@Body() dto: CreateTeamDto, @Param('teamId') teamId: string) {
    return this.teamService.updateATeam(teamId, dto);
  }

  @ApiOperation({ summary: 'Delete a team' })
  @Delete(':teamId')
  async deleteATeam(@Param('teamId') teamId: string) {
    return this.teamService.deleteATeam(teamId);
  }

  @ApiOperation({ summary: 'Get A Team' })
  @Get(':teamId')
  async getATeam(@Param('teamId') teamId: string) {
    return this.teamService.getATeam(teamId);
  }
}
