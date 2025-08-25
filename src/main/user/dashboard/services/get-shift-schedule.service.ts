import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class GetShiftScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Error getting shift schedule')
  async getShiftSchedule(projectId: string): Promise<TResponse<any>> {
    const projectUsers = await this.prisma.projectUser.findMany({
      where: { projectId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
    return successResponse(
      projectUsers,
      'Shift schedule retrieved successfully',
    );
  }
}
