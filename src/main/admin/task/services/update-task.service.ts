import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateTaskDto } from '../dto/task.dto';

@Injectable()
export class UpdateTaskService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to update task')
  async updateTask(
    taskId: string,
    dto: UpdateTaskDto,
    attachmentUrl: string | null,
  ): Promise<TResponse<any>> {
    // 1. Ensure task exists
    const existing = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!existing) {
      throw new AppError(404, 'Task not found');
    }

    // 2. Build update data
    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.startTime) data.startTime = dto.startTime;
    if (dto.endTime) data.endTime = dto.endTime;
    if (dto.location !== undefined) data.location = dto.location;
    if (dto.labels) data.labels = dto.labels;
    if (attachmentUrl !== null) {
      data.attachment = attachmentUrl;
    }

    // 3. Perform update
    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data,
      include: { tasksUsers: { include: { user: true } }, project: true },
    });

    return successResponse(updated, 'Task updated successfully');
  }
}
