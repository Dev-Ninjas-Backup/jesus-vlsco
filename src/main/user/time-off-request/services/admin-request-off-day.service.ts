import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { EVENT_TYPES } from '@project/common/interface/events-name';
import { TimeOffEvent } from '@project/common/interface/events-payload';
import { successPaginatedResponse, successResponse, TPaginatedResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { AdminRequestOffDayStatusDto, GetTimeOffRequestDto } from '../dto/admin-off-day-request.dto';

@Injectable()
export class AdminRequestOffDayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  @HandleError('Failed to get all off day requests')
  async getAllOffDayRequests(query: GetTimeOffRequestDto): Promise<TPaginatedResponse<any>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 15;
    const skip = (page - 1) * limit;

    // Build dynamic where filter
    const where: any = {};

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.startDate && query.endDate) {
      // requests that overlap with [startDate, endDate]
      where.OR = [
        {
          startDate: { gte: new Date(query.startDate) },
          endDate: { lte: new Date(query.endDate) },
        },
        {
          startDate: { lte: new Date(query.endDate) },
          endDate: { gte: new Date(query.startDate) },
        },
      ];
    } else if (query.startDate) {
      where.endDate = { gte: new Date(query.startDate) };
    } else if (query.endDate) {
      where.startDate = { lte: new Date(query.endDate) };
    }

    const total = await this.prisma.timeOffRequest.count({ where });
    const totalPage = Math.ceil(total / limit);

    const requests = await this.prisma.timeOffRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return successPaginatedResponse(
      requests,
      { page, limit, total },
      'All off day requests retrieved successfully',
    );
  }

  @HandleError('Failed to update off day request')
  async updateOffDayRequest(
    requestId: string,
    dto: AdminRequestOffDayStatusDto,
  ) {
    const { status, adminNote } = dto;

    const existingRequest = await this.prisma.timeOffRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!existingRequest) {
      throw new AppError(404, 'Request not found');
    }

    const updatedRequest = await this.prisma.timeOffRequest.update({
      where: { id: requestId },
      data: { status, adminNote },
    });

    // * todo: send notification to the user (who created the request)
    const payload: TimeOffEvent = {
      action: 'STATUS_CHANGE',
      meta: {
        requestId: updatedRequest.id,
        userId: updatedRequest.userId,
        startDate: new Date(updatedRequest.startDate).toISOString(),
        endDate: new Date(updatedRequest.endDate).toISOString(),
        status: updatedRequest.status,
        performedBy: updatedRequest.userId,
      },
    };
    this.eventEmitter.emit(EVENT_TYPES.TIME_OFF_STATUS_CHANGE, payload);

    return successResponse(
      updatedRequest,
      'Off day request updated successfully',
    );
  }
}
