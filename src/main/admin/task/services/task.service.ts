import { Injectable } from '@nestjs/common';
import { successResponse, TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllTasks(): Promise<TResponse<any>> {
    const tasks = await this.prisma.task.findMany();
    return successResponse(tasks, 'Tasks data fetched successfully');
  }
}
