import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { GetTasksDto } from '../dto/get-tasks.dto';

@Injectable()
export class GetAllTasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  @HandleError('Error getting all tasks')
  async getAllTasks(filters: GetTasksDto): Promise<TResponse<any>> {
    const {
      projectId,
      userId,
      status,
      search,
      startAfter,
      endBefore,
      labels,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      groupBy = 'title',
    } = filters;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (startAfter || endBefore) {
      where.startTime = {};
      if (startAfter) where.startTime.gte = new Date(startAfter);
      if (endBefore) where.endTime.lte = new Date(endBefore);
    }
    if (labels && labels.length) {
      where.labels = { hasEvery: labels };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (userId) {
      where.tasksUsers = { some: { userId } };
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const total = await this.prisma.task.count({ where });

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
      include: {
        project: true,
        tasksUsers: { include: { user: true } },
      },
    });

    return successResponse(
      {
        data: tasks,
        meta: { total, page, limit, pages: Math.ceil(total / limit) },
      },
      'Tasks fetched successfully',
    );
  }
}
