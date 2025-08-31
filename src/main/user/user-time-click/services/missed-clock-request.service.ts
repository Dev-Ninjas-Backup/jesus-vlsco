import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import {
  CreateMissedClockRequestDto,
  UpdateClockRequestDto,
} from '../dto/request-clock.dto';

@Injectable()
export class MissedClockRequestService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get missed clock requests', 'MISSED_CLOCK_REQUEST')
  async getMissedClockRequests(
    userId: string,
    pg: PaginationDto,
  ): Promise<TPaginatedResponse<any>> {
    const page = pg.page && pg.page > 0 ? pg.page : 1;
    const limit = pg.limit && pg.limit > 0 ? pg.limit : 20;
    const skip = (page - 1) * limit;

    const [requests, totalCount] = await this.prisma.$transaction([
      this.prisma.missedClockRequest.findMany({
        where: {
          userId,
          status: 'PENDING',
        },
        include: {
          user: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.missedClockRequest.count({
        where: {
          userId,
          status: 'PENDING',
        },
      }),
    ]);

    return successPaginatedResponse(
      requests,
      { page, limit, total: totalCount },
      'Missed clock requests retrieved successfully',
    );
  }

  @HandleError('Failed to get missed clock request', 'MISSED_CLOCK_REQUEST')
  async getSingleMissedClockRequest(userId: string, requestId: string) {
    const request = await this.prisma.missedClockRequest.findUnique({
      where: { id: requestId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        shift: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!request) {
      throw new AppError(404, 'Request not found');
    }

    if (request.userId !== userId) {
      throw new AppError(
        403,
        'You do not have permission to view this request',
      );
    }

    const formattedOutput = {
      ...request,
      user: request.user.profile,
      shift: {
        ...request.shift,
        project: request?.shift?.project,
      },
    };

    return successResponse(
      formattedOutput,
      'Missed clock request retrieved successfully',
    );
  }

  @HandleError('Failed to create missed clock request', 'MISSED_CLOCK_REQUEST')
  async requestClock(
    userId: string,
    dto: CreateMissedClockRequestDto,
  ): Promise<TResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const shift = await this.prisma.shift.findUnique({
      where: { id: dto.shiftId },
    });

    if (!shift) {
      throw new AppError(404, 'Shift not found');
    }

    const dtoWithOutShift = { ...dto };
    delete dtoWithOutShift.shiftId;

    const request = await this.prisma.missedClockRequest.create({
      data: {
        userId,
        status: 'PENDING',
        ...(shift && { shiftId: shift.id }),
        ...dtoWithOutShift,
      },
    });

    return successResponse(
      request,
      'Missed clock request created successfully',
    );
  }

  @HandleError('Failed to cancel missed clock request', 'MISSED_CLOCK_REQUEST')
  async cancelRequest(userId: string, requestId: string) {
    const request = await this.prisma.missedClockRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new AppError(404, 'Request not found');
    }

    if (request.userId !== userId) {
      throw new AppError(
        403,
        'You do not have permission to cancel this request',
      );
    }

    if (request.status !== 'PENDING') {
      throw new AppError(400, 'Request has already been processed');
    }

    await this.prisma.missedClockRequest.delete({
      where: { id: requestId },
    });

    return successResponse(null, 'Request cancelled successfully');
  }

  async updateAPendingRequest(
    userId: string,
    requestId: string,
    dto: UpdateClockRequestDto,
  ) {
    const request = await this.prisma.missedClockRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new AppError(404, 'Request not found');
    }

    if (request.userId !== userId) {
      throw new AppError(
        403,
        'You do not have permission to update this request',
      );
    }

    if (request.status !== 'PENDING') {
      throw new AppError(400, 'Request has already been processed');
    }

    const updatedRequest = await this.prisma.missedClockRequest.update({
      where: { id: requestId },
      data: {
        ...dto,
      },
    });

    return successResponse(updatedRequest, 'Request updated successfully');
  }
}
