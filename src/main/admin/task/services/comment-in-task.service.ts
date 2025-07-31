import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { AddTaskCommentDto } from '../dto/add-comment-in-task.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { successResponse } from '@project/common/utils/response.util';

@Injectable()
export class CommentInTaskService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Comment Failed!!!')
  async addComment(dto: AddTaskCommentDto, userId: string, taskId: string) {
    const isTaskExist = await this.prisma.task.findUniqueOrThrow({
      where: { id: taskId },
    });
    if (!isTaskExist) {
      throw new AppError(404, 'Task not found');
    }

    const result = await this.prisma.taskComment.create({
      data: {
        comment: dto.comment,
        commentBy: userId,
        taskId,
      },
    });

    return successResponse(result, 'Comment in task');
  }
}
