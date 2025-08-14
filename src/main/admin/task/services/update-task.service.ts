import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class UpdateTaskService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to update task')
  async updateTask(
    taskId: string,
    dto: UpdateTaskDto,
    attachmentUrl: string | null,
  ): Promise<TResponse<any>> {
    // 1. Get existing
    const existing = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { tasksUsers: { include: { user: true } }, project: true },
    });
    if (!existing) {
      throw new AppError(404, 'Task not found');
    }
    // * check if assign user is changed
    if (dto.assignUserId) {
      const isChanged = dto.assignUserId !== existing.tasksUsers[0].userId;

      // * if assign user is changed then delete existing and create new
      if (isChanged) {
        const isUserExist = await this.prisma.user.findUnique({
          where: { id: dto.assignUserId },
        });
        if (!isUserExist) {
          throw new AppError(404, 'User not found');
        }
        await this.prisma.taskUser.deleteMany({
          where: { taskId },
        });
        await this.prisma.taskUser.create({
          data: {
            taskId,
            userId: dto.assignUserId,
          },
        });
      }
    }

    // * check if project is changed
    let isProjectChanged = false;
    if (dto.projectId) {
      const isProjectExist = await this.prisma.project.findUnique({
        where: { id: dto.projectId },
      });
      if (!isProjectExist) {
        throw new AppError(404, 'Project not found');
      }
      isProjectChanged = dto.projectId !== existing.projectId;
    }

    // 2. Perform update
    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        ...(dto.title !== undefined &&
          dto.title.trim() !== '' && { title: dto.title }),
        ...(dto.description !== undefined &&
          dto.description.trim() !== '' && { description: dto.description }),
        ...(dto.startTime && { startTime: dto.startTime }),
        ...(dto.endTime && { endTime: dto.endTime }),
        ...(dto.location !== undefined &&
          dto.location.trim() !== '' && { location: dto.location }),
        ...(dto.labels && { labels: dto.labels }),
        ...(attachmentUrl !== null && { attachment: attachmentUrl }),
        ...(isProjectChanged && {
          project: { connect: { id: dto.projectId } },
        }),
      },
      include: {
        tasksUsers: { include: { user: { include: { profile: true } } } },
        project: true,
        taskComments: {
          include: { commentar: { include: { profile: true } } },
        },
      },
    });

    return successResponse(updated, 'Task updated successfully');
  }
}
