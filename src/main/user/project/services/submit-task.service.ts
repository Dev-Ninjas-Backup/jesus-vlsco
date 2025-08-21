import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class SubmitTaskService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to submit task')
  async submitTask(
    taskId: string,
    attachmentUrl: string | null,
  ): Promise<TResponse<any>> {
    // 1. Ensure task exists
    const existing = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { tasksUsers: true },
    });
    if (!existing) {
      throw new AppError(404, 'Task not found');
    }

    if (
      !existing.tasksUsers.some(
        (tu) => tu.userId === existing.tasksUsers[0].userId,
      )
    ) {
      throw new AppError(403, 'You are not assigned to this task');
    }

    // 2. Perform update
    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        attachment: attachmentUrl ?? '',
        status: 'DONE',
      },
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
        project: true,
      },
    });

    return successResponse(updated, 'Task updated successfully');
  }
}
