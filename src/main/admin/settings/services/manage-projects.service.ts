import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { ManageProjectDto } from '../dto/manage-project.dto';

@Injectable()
export class ManageProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to manage projects')
  async manageProjects(dto: ManageProjectDto): Promise<TResponse> {
    const existingProjects = await this.prisma.project.findMany();
    console.log(existingProjects, dto);

    return successResponse(existingProjects);
  }
}
