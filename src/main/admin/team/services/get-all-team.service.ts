import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetTeamsDto } from '../dto/get-teams.dto';

@Injectable()
export class GetAllTeamsService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError("Can't get all teams")
  async getAllTeamsService(filters: GetTeamsDto): Promise<TResponse<any>> {
    const {
      title,
      memberId,
      projectId,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
    } = filters;

    // Build dynamic where
    const where: any = {};
    if (title) {
      where.title = { contains: title, mode: 'insensitive' };
    }
    if (memberId) {
      where.members = { some: { userId: memberId } };
    }
    if (projectId) {
      where.projects = { some: { id: projectId } };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const take = limit;

    // Total count
    const total = await this.prisma.team.count({ where });

    // Fetch data
    const data = await this.prisma.team.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
      include: {
        members: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        projects: true,
      },
    });

    return successResponse(
      {
        teams: data,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      'Teams data fetched successfully',
    );
  }
}
