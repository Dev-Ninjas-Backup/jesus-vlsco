import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';

@Injectable()
export class SubmitTaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) { }

  @HandleError('Failed to submit task')
  async submitTask(
    taskId: string,
    attachmentUrl: string | null,
  ): Promise<TResponse<any>> {
    if (!attachmentUrl) {
      return successResponse(null, 'Task submitted successfully');
    }

    // 1. Ensure task exists
    const existing = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!existing) {
      throw new AppError(404, 'Task not found');
    }

    // 2. Perform update
    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        attachment: attachmentUrl,
        status: 'DONE',
      },
      include: { tasksUsers: { include: { user: true } }, project: true },
    });

    return successResponse(updated, 'Task updated successfully');
  }
}
