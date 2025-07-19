import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse, TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateTeamDto, UpdateTeamDto } from '../dto/team.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) { }

  @HandleError('Failed to create team')
  async createATeam(dto: CreateTeamDto): Promise<TResponse<any>> {
    const team = await this.prisma.team.create({
      data: { ...dto },
    });

    return successResponse(team, 'Team added successfully');
  }

  @HandleError('Failed to update team')
  async updateATeam(id: string, dto: UpdateTeamDto): Promise<TResponse<any>> {
    await this.ensureTeamExists(id);

    const team = await this.prisma.team.update({
      where: { id },
      data: { ...dto },
    });

    return successResponse(team, 'Team updated successfully');
  }

  @HandleError('Failed to delete team')
  async deleteATeam(id: string): Promise<TResponse<any>> {
    await this.ensureTeamExists(id);

    const team = await this.prisma.team.delete({
      where: { id },
    });

    return successResponse(team, 'Team deleted successfully');
  }

  @HandleError('Failed to get team')
  async getATeam(id: string): Promise<TResponse<any>> {
    await this.ensureTeamExists(id);

    const team = await this.prisma.team.findUnique({
      where: { id },
    });

    return successResponse(team, 'Team found successfully');
  }

  private async ensureTeamExists(teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!team) throw new AppError(404, 'Team not found');
    return team;
  }
}
