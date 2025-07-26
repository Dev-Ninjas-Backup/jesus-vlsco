import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successPaginatedResponse, TPaginatedResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) { }

  @HandleError('Failed to get all project with its tasks')
  async getAllProjectWithItsTasks(dto: PaginationDto): Promise<TPaginatedResponse<any>> {
    const page = Math.max(Number(dto.page) || 1, 1);
    const limit = Math.min(Number(dto.limit) || 10, 100);

    const project = await
      this.prisma.project.findMany({
        include: {
          tasks: {
            include: {
              tasksUsers: {
                include: {
                  user: true,
                },
              }
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit
      })
      console.log(project);


    return successPaginatedResponse(project, { page: 1, limit: 10, total: 1 });
  }
}
