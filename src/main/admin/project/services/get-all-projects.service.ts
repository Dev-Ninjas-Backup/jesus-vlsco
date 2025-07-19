import { Injectable } from '@nestjs/common';
import { successResponse, TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetProjectsDto } from '../dto/get-projects.dto';

@Injectable()
export class GetAllProjectsService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllProjects(filters: GetProjectsDto): Promise<TResponse<any>> {
    const {
      managerId,
      teamId,
      assignedUserId,
      projectLocation,
      search,
      status,
      createdAfter,
      createdBefore,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    // Build dynamic `where` clause
    const where: any = {};

    if (managerId) where.managerId = managerId;
    if (teamId) where.teamId = teamId;
    if (projectLocation) {
      where.projectLocation = {
        contains: projectLocation,
        mode: 'insensitive',
      };
    }
    if (createdAfter || createdBefore) {
      where.createdAt = {};
      if (createdAfter) where.createdAt.gte = new Date(createdAfter);
      if (createdBefore) where.createdAt.lte = new Date(createdBefore);
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { projectLocation: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (assignedUserId) {
      where.projectUsers = {
        some: { userId: assignedUserId },
      };
    }
    if (status) {
      // only include projects having at least one task with this status
      where.tasks = { some: { status } };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const take = limit;

    // Total count (for meta)
    const total = await this.prisma.project.count({ where });

    // Fetch page of data
    const data = await this.prisma.project.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
      include: {
        team: true,
        manager: true,
        projectUsers: { include: { user: true } },
        tasks: true,
      },
    });

    // Return a paginated envelope
    return successResponse({
      projects: data,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }, 'Projects data fetched successfully');
  }
}
