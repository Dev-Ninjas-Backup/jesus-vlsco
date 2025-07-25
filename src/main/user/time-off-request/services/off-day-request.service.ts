import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import {
  CreateTimeOffRequestDto,
  UpdateTimeOffRequestDto,
} from '../dto/off-day-request.dto';

@Injectable()
export class OffDayRequestService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Unable to create time off request')
  async createOffDayRequset(dto: CreateTimeOffRequestDto, userId: string) {
    const { startDate, endDate, reason, isFullDayOff, totalDaysOff } = dto;

    const result = await this.prisma.timeOffRequest.create({
      data: {
        startDate,
        endDate,
        reason,
        isFullDayOff,
        totalDaysOff,
        userId,
      },
    });

    // * todo: send notification to the admin
    return successResponse(result, 'Time off request created successfully');
  }

  @HandleError('Unable to get off day requests')
  async getOffDayRequests(userId: string) {
    const requests = await this.prisma.timeOffRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(requests, 'Off day requests retrieved successfully');
  }

  @HandleError('Unable to update time off request')
  async updateOffDayRequest(
    requestId: string,
    dto: UpdateTimeOffRequestDto,
    userId: string,
  ) {
    const { startDate, endDate, reason, isFullDayOff, totalDaysOff } = dto;

    const existingRequest = await this.prisma.timeOffRequest.findUnique({
      where: { id: requestId },
    });

    if (!existingRequest || existingRequest.userId !== userId) {
      throw new AppError(
        403,
        'Request not found or you do not have permission to update it',
      );
    }

    // * todo: send notification to the admin

    const updatedRequest = await this.prisma.timeOffRequest.update({
      where: { id: requestId },
      data: {
        startDate,
        endDate,
        reason,
        isFullDayOff,
        totalDaysOff,
      },
    });

    return successResponse(
      updatedRequest,
      'Time off request updated successfully',
    );
  }

  @HandleError('Unable to delete time off request')
  async deleteOffDayRequest(userId: string, requestId: string) {
    const existingRequest = await this.prisma.timeOffRequest.findUnique({
      where: { id: requestId },
    });

    if (!existingRequest || existingRequest.userId !== userId) {
      throw new AppError(
        403,
        'Request not found or you do not have permission to delete it',
      );
    }

    await this.prisma.timeOffRequest.delete({
      where: { id: requestId },
    });

    return successResponse(null, 'Time off request deleted successfully');
  }
}
