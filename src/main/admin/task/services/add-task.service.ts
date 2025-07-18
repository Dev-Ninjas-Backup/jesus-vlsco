import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { AddTaskDto } from '../dto/add-task.dto';

@Injectable()
export class AddTaskService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to create task')
  async createTask(dto: AddTaskDto, fileUrl: string) {
    // return await this.prisma.task.create({
    //   data: dto,
    // });
    return {
      title: dto.title,
      description: dto.description,
      fileUrl,
    }
  }
}
