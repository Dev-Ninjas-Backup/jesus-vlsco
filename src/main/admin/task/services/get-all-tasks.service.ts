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

    // Build the where clause
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

    // Count total tasks
    const total = await this.prisma.task.count({ where });

    // Fetch tasks with relations needed for grouping
    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
      include: {
        project: true,
        tasksUsers: {
          include: {
            user: {
              include: {
                profile: true,
                payroll: true,
                shift: true,
                taskUsers: true,
              },
            },
          },
        },
      },
    });

    // Group tasks according to the groupBy filter
    const grouped: Record<string, typeof tasks> = {};
    switch (groupBy) {
      case 'assignedTo':
        tasks.forEach((task) => {
          if (task.tasksUsers?.length) {
            task.tasksUsers.forEach((tu) => {
              const key = tu.user.email;
              if (!grouped[key]) grouped[key] = [];
              grouped[key].push(task);
            });
          } else {
            const key = 'UNASSIGNED';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(task);
          }
        });
        break;

      case 'label':
        tasks.forEach((task) => {
          const key = task.labels ?? 'UNLABELED';
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(task);
        });
        break;

      case 'title':
      default:
        tasks.forEach((task) => {
          const key = `${task.title}#${task.projectId}`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(task);
        });
        break;
    }

    // Prepare metadata
    const pages = Math.ceil(total / limit);

    const overdueTasks = await this.prisma.task.findMany({
      where: {
        startTime: { lte: new Date() },
        endTime: { gte: new Date() },
        status: { not: 'DONE' },
      },
      include: {
        project: true,
        tasksUsers: {
          include: {
            user: {
              include: {
                profile: true,
                payroll: true,
                shift: true,
                taskUsers: true,
              },
            },
          },
        },
      },
    });

    const totalDone = tasks.filter((task) => task.status === 'DONE').length;

    // Return response with grouped data
    return successResponse(
      {
        data: tasks,
        analytics: {
          total,
          done: totalDone,
          open: total - totalDone,
        },
        overdueTasks,
        grouped,
        meta: { total, page, limit, pages },
      },
      'Tasks fetched successfully',
    );
  }

  // * get all tasks that are not assigned to any a user
  @HandleError('Error getting all unassigned tasks')
  async getAllUnassignedTasks(userId: string): Promise<TResponse<any>> {
    const tasks = await this.prisma.task.findMany({
      where: { tasksUsers: { none: { userId } } },
    });
    return successResponse(tasks, 'Tasks fetched successfully');
  }
}
