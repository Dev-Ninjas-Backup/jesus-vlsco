import { Injectable } from '@nestjs/common';
import { RequestOverTimeStatus } from '@prisma/client';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { ApproveOrRejectShiftRequest } from '../dto/time-clock.dto';

@Injectable()
export class OvertimeService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Error getting all pending overtime')
  async getAllPendingOvertime(
    pg: PaginationDto,
  ): Promise<TPaginatedResponse<any>> {
    const page = pg.page && pg.page > 0 ? pg.page : 1;
    const limit = pg.limit && pg.limit > 0 ? pg.limit : 10;
    const skip = (page - 1) * limit;

    const [totalCount, overtime] = await this.prisma.$transaction([
      this.prisma.requestOverTime.count(),
      this.prisma.requestOverTime.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          timeClock: true,
          user: true,
        },
        where: {
          status: RequestOverTimeStatus.PENDING,
        },
      }),
    ]);

    return successPaginatedResponse(
      overtime,
      { page, limit, total: totalCount },
      'Overtime retrieved successfully',
    );
  }

  @HandleError('Error getting single overtime')
  async getSingleOvertime(id: string): Promise<TResponse<any>> {
    const overtime = await this.prisma.requestOverTime.findUnique({
      where: { id },
      include: {
        timeClock: true,
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return successResponse(overtime, 'Overtime retrieved successfully');
  }

  @HandleError('Error accepting or rejecting overtime')
  async acceptOrRejectOvertime(
    id: string,
    dto: ApproveOrRejectShiftRequest,
  ): Promise<TResponse<any>> {
    const overtime = await this.prisma.requestOverTime.update({
      where: { id },
      data: {
        status: dto.isApproved
          ? RequestOverTimeStatus.APPROVED
          : RequestOverTimeStatus.REJECTED,
        timeClock: {
          update: {
            isOvertimeAllowed: dto.isApproved,
          },
        },
      },
      include: {
        timeClock: true,
      },
    });

    return successResponse(overtime, 'Overtime updated successfully');
  }
}
