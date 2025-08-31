import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { ApproveOrRejectShiftRequest } from '../dto/time-clock.dto';

@Injectable()
export class ManageClockRequestService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get clock request')
  async getClockRequest(pg: PaginationDto): Promise<TResponse<any>> {
    const page = pg.page && pg.page > 0 ? pg.page : 1;
    const limit = pg.limit && pg.limit > 0 ? pg.limit : 10;
    const skip = (page - 1) * limit;

    const requests = await this.prisma.missedClockRequest.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
      },
    });

    return successResponse(requests, 'Clock request found successfully');
  }

  @HandleError('Failed to get single clock request')
  async getSingleClockRequest(id: string) {
    const request = await this.prisma.missedClockRequest.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!request) {
      throw new AppError(404, 'Clock request not found');
    }

    return successResponse(request, 'Clock request found successfully');
  }

  @HandleError('Failed to update clock request')
  async acceptOrRejectClockRequest(
    id: string,
    dto: ApproveOrRejectShiftRequest,
  ) {
    const request = await this.prisma.missedClockRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new AppError(404, 'Clock request not found');
    }

    await this.prisma.missedClockRequest.update({
      where: { id },
      data: {
        status: dto.isApproved ? 'APPROVED' : 'REJECTED',
      },
    });

    return successResponse(
      null,
      `Clock request ${dto.isApproved ? 'approved' : 'rejected'} successfully`,
    );
  }
}
