import { Injectable } from '@nestjs/common';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { HandleError } from '@project/common/error/handle-error.decorator';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to create project')
  async createProject(dto: CreateProjectDto): Promise<TResponse<any>> {
    const project = await this.prisma.project.create({
      data: {
        ...dto,
      },
    });

    return successResponse(project, 'Project added successfully');
  }

  @HandleError('Failed to assign project')
  async assignProjectToEmployee(projectId: string, userId: string) {
    const project = await this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        projectUsers: {
          create: {
            userId,
          },
        },
      },
    });
    return successResponse(project, 'Project assigned successfully');
  }
}
