import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  @HandleError('Failed to get all project with its tasks')
  async getAllProjectWithItsTasks(
    dto: PaginationDto,
  ): Promise<TPaginatedResponse<any>> {
    const page = Math.max(Number(dto.page) || 1, 1);
    const limit = Math.min(Number(dto.limit) || 10, 100);

    const project = await this.prisma.project.findMany({
      include: {
        tasks: {
          include: {
            tasksUsers: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return successPaginatedResponse(project, { page: 1, limit: 10, total: 1 });
  }

  @HandleError('Failed to get a task')
  async getATask(taskId: string, userId: string): Promise<TResponse<any>> {
    await this.utils.ensureUserInProject(taskId, userId);

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        tasksUsers: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    return successResponse(task, 'Task retrieved successfully');
  }

  @HandleError('Failed to start a task')
  async startATask(taskId: string, userId: string): Promise<TResponse<any>> {
    await this.utils.ensureUserInProject(taskId, userId);

    await this.prisma.task.update({
      where: { id: taskId },
      data: { status: 'OPEN' },
    });

    return successResponse(null, 'Task started successfully');
  }
}
