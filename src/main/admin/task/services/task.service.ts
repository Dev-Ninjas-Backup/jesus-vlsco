import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse, TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { AssignEmployeesToTaskDto } from '../dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService
  ) { }

  @HandleError('Error getting all tasks')
  async getAllTasks(): Promise<TResponse<any>> {
    const tasks = await this.prisma.task.findMany();
    return successResponse(tasks, 'Tasks data fetched successfully');
  }

  @HandleError('Error getting task by id')
  async getTaskById(id: string): Promise<TResponse<any>> {
    const task = await this.utils.ensureTaskExists(id);

    return successResponse(task, 'Task found successfully');
  }

  @HandleError('Error deleting task')
  async deleteTask(id: string): Promise<TResponse<any>> {
    await this.utils.ensureTaskExists(id);

    const task = await this.prisma.task.delete({
      where: { id },
    });
    return successResponse(task, 'Task deleted successfully');
  }

  @HandleError('Error assigning employee to task')
  async assignEmployeeToTask(taskId: string, userId: string): Promise<TResponse<any>> {
    await this.utils.ensureTaskExists(taskId);
    await this.utils.ensureUserExists(userId);

    const already = await this.prisma.taskUser.findUnique({
      where: {
        taskId_userId: { taskId, userId },
      },
    });
    if (already) throw new AppError(400, 'Task already assigned');

    const taskUser = await this.prisma.taskUser.create({
      data: { taskId, userId },
    });

    return successResponse(taskUser, 'Task assigned successfully');
  }

  @HandleError('Error un assigning employee from task')
  async unassignEmployeeFromTask(taskId: string, userId: string): Promise<TResponse<any>> {
    await this.utils.ensureTaskExists(taskId);
    await this.utils.ensureUserExists(userId);

    const taskUser = await this.prisma.taskUser.delete({
      where: { taskId_userId: { taskId, userId } },
    });

    return successResponse(taskUser, 'Task unassigned successfully');
  }

  async assignEmployeesToTask(taskId: string, dto: AssignEmployeesToTaskDto): Promise<TResponse<any>> {
    await this.utils.ensureTaskExists(taskId);
    await this.utils.ensureUsersExists(dto.employees);

    const uniqueIds = this.utils.removeDuplicateIds(dto.employees);

    const taskUser = await this.prisma.taskUser.createMany({
      data: uniqueIds.map((userId) => ({ taskId, userId })),
    });

    return successResponse(taskUser, 'Task assigned successfully');
  }
}
