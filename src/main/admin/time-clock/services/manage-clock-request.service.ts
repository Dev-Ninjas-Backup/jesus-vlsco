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
    adminId: string,
  ) {
    // * check if request exists
    const request = await this.prisma.missedClockRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new AppError(404, 'Clock request not found');
    }

    // * check if request has already been processed
    if (request.status !== 'PENDING') {
      throw new AppError(400, 'Request has already been processed');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // update and return request
      const updatedRequest = await tx.missedClockRequest.update({
        where: { id },
        data: {
          status: dto.isApproved ? 'APPROVED' : 'REJECTED',
          reviewedAt: new Date().toISOString(),
          reviewedBy: adminId,
        },
      });

      let clock: any = null;

      if (dto.isApproved) {
        const {
          requestedClockInAt,
          requestedClockOutAt,
          locationLat,
          locationLng,
          userId,
          shiftId,
        } = updatedRequest;

        if (!requestedClockInAt || !requestedClockOutAt) {
          throw new AppError(
            400,
            'Clock in/out times are required for approval',
          );
        }

        // Calculate total hours
        const totalMs =
          requestedClockOutAt.getTime() - requestedClockInAt.getTime();
        const totalHours = Math.max(totalMs / (1000 * 60 * 60), 0);

        // Overtime = total - 8
        const overtimeHours = Math.max(totalHours - 8, 0);

        clock = await tx.timeClock.create({
          data: {
            userId,
            shiftId,
            clockInAt: requestedClockInAt,
            clockOutAt: requestedClockOutAt,
            clockInLat: locationLat,
            clockInLng: locationLng,
            clockOutLat: locationLat,
            clockOutLng: locationLng,
            isOvertimeAllowed: overtimeHours > 0,
            totalHours,
            overtimeHours,
            status: 'COMPLETED',
          },
        });
      }

      return {
        request: updatedRequest,
        clockData: clock,
      };
    });

    return successResponse(
      result,
      `Clock request ${dto.isApproved ? 'approved' : 'rejected'} successfully`,
    );
  }
}
