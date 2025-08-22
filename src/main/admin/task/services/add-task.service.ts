import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { AddTaskDto } from '../dto/add-task.dto';
import { AppError } from '@project/common/error/handle-error.app';

@Injectable()
export class AddTaskService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to create task', 'Task')
  async createTask(
    dto: AddTaskDto,
    fileUrl: string | null,
  ): Promise<TResponse<any>> {
    // * validate project exists
    const project = await this.prisma.project.findUnique({
      where: {
        id: dto.projectId,
      },
    });
    if (!project) {
      throw new AppError(404, 'Project not found');
    }

    // * validate user exists
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.assignUserId,
      },
    });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        attachment: fileUrl,
        startTime: dto.startTime,
        endTime: dto.endTime,
        location: dto.location,
        labels: dto.labels,
        status: dto.status,
        project: {
          connect: {
            id: dto.projectId,
          },
        },
        tasksUsers: {
          create: {
            user: {
              connect: {
                id: dto.assignUserId,
              },
            },
          },
        },
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
      },
    });

    return successResponse(task, 'Task created successfully');
  }
}
