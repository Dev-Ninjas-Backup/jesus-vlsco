import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { AddTaskDto } from '../dto/add-task.dto';

@Injectable()
export class AddTaskService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to create task')
  async createTask(
    dto: AddTaskDto,
    fileUrl: string | null,
    projectId: string,
  ): Promise<TResponse<any>> {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        attachment: fileUrl,
        startTime: dto.startTime,
        endTime: dto.endTime,
        location: dto.location,
        labels: dto.labels,
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });

    return successResponse(task, 'Task created successfully');
  }
}
