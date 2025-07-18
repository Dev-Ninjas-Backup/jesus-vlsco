import { Injectable } from '@nestjs/common';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateProjectDto } from '../dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(dto: CreateProjectDto): Promise<TResponse<any>> {
    const project = await this.prisma.project.create({
      data: {
        ...dto,
      },
    });

    return successResponse(project, 'Project added successfully');
  }
}
