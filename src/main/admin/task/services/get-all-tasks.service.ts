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
      where.endTime = {};
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

    const actualTotal = await this.prisma.task.count({
      where: {
        tasksUsers: { some: {} },
      },
    });

    // 🔹 Count only tasks WITH assigned users
    const total = await this.prisma.task.count({
      where: { ...where, tasksUsers: { some: {} } },
    });

    // 🔹 Fetch tasks with relations (only assigned)
    const rawTasks = await this.prisma.task.findMany({
      where: { ...where, tasksUsers: { some: {} } },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take,
      include: {
        tasksUsers: {
          include: {
            user: { include: { profile: true } },
          },
        },
      },
    });

    // 🔹 Map tasks to include assignTo info
    const tasks = rawTasks.map((task) => {
      const firstUser = task.tasksUsers[0]?.user;
      const profile = firstUser?.profile;

      let name = 'UNNAMED';
      if (profile?.firstName && profile?.lastName) {
        name = `${profile.firstName} ${profile.lastName}`;
      } else if (profile?.firstName) {
        name = profile.firstName;
      } else if (profile?.lastName) {
        name = profile.lastName;
      }

      const profileUrl =
        profile?.profileUrl ??
        `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
          name,
        )}&bold=false&length=1`;

      return {
        ...task,
        assignTo: { name, profileUrl },
      };
    });

    // 🔹 Group tasks by requested field
    const grouped: Record<string, typeof tasks> = {};
    switch (groupBy) {
      case 'assignedTo':
        tasks.forEach((task) => {
          const key = `${task.assignTo.name}#${task.assignTo.profileUrl}`;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(task);
        });
        break;

      case 'label':
        tasks.forEach((task) => {
          const key = task.labels?.[0] ?? 'UNLABELED';
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(task);
        });
        break;

      case 'title':
      default:
        tasks.forEach((task) => {
          const key = task.title ?? 'UNTITLED';
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(task);
        });
        break;
    }

    // 🔹 Overdue tasks (only with assigned users)
    const overdueTasks = await this.prisma.task.findMany({
      where: {
        startTime: { lte: new Date() },
        endTime: { gte: new Date() },
        status: { not: 'DONE' },
        tasksUsers: { some: {} },
      },
      include: {
        tasksUsers: {
          include: {
            user: { include: { profile: true } },
          },
        },
      },
    });

    // 🔹 Analytics
    const totalDone = tasks.filter((task) => task.status === 'DONE').length;
    const totalOpen = tasks.length - totalDone;

    const pages = Math.ceil(total / limit);

    return successResponse(
      {
        analytics: {
          total: actualTotal,
          done: totalDone,
          open: totalOpen,
        },
        data: tasks,
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
