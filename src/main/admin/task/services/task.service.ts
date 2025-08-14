import { Injectable } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { AssignEmployeesToTaskDto } from '../dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  @HandleError('Error getting task by id')
  async getTaskById(id: string): Promise<TResponse<any>> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        tasksUsers: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        taskComments: {
          include: {
            commentar: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new AppError(404, 'Task not found');
    }

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

  @HandleError('Error deleting multiple tasks')
  async deleteMultipleTasks(ids: string[]): Promise<TResponse<any>> {
    const tasks = await this.prisma.task.deleteMany({
      where: { id: { in: ids } },
    });
    return successResponse(tasks, 'Tasks deleted successfully');
  }

  @HandleError('Error assigning employee to task')
  async assignEmployeeToTask(
    taskId: string,
    userId: string,
  ): Promise<TResponse<any>> {
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
  async unassignEmployeeFromTask(
    taskId: string,
    userId: string,
  ): Promise<TResponse<any>> {
    await this.utils.ensureTaskExists(taskId);
    await this.utils.ensureUserExists(userId);

    const taskUser = await this.prisma.taskUser.delete({
      where: { taskId_userId: { taskId, userId } },
    });

    return successResponse(taskUser, 'Task unassigned successfully');
  }

  @HandleError('Error assigning employees to task')
  async assignEmployeesToTask(
    taskId: string,
    dto: AssignEmployeesToTaskDto,
  ): Promise<TResponse<any>> {
    await this.utils.ensureTaskExists(taskId);
    await this.utils.ensureUsersExists(dto.employees);

    const uniqueIds = this.utils.removeDuplicateIds(dto.employees);

    const taskUser = await this.prisma.taskUser.createMany({
      data: uniqueIds.map((userId) => ({ taskId, userId })),
    });

    return successResponse(taskUser, 'Task assigned successfully');
  }

  @HandleError('Error updating project of task')
  async updateProjectOfTask(taskId: string, projectId: string) {
    await this.utils.ensureTaskExists(taskId);
    await this.utils.ensureProjectExists(projectId);

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        project: { connect: { id: projectId } },
      },
    });

    return successResponse(task, 'Task updated successfully');
  }

  @HandleError('Error updating status of task')
  async updateStatus(taskId: string, status: TaskStatus) {
    await this.utils.ensureTaskExists(taskId);
    const task = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        status,
      },
    });
    return successResponse(task, 'Task updated successfully');
  }
}
