import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import {
  CreateTimeOffRequestDto,
  UpdateTimeOffRequestDto,
} from '../dto/off-day-request.dto';
import { successResponse } from '@project/common/utils/response.util';

@Injectable()
export class OffDayRequestService {
  constructor(private readonly prisma: PrismaService) {}

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
    return successResponse(result, 'Time off request created successfully');
  }

  async getOffDayRequests(userId: string) {
    const requests = await this.prisma.timeOffRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(requests, 'Off day requests retrieved successfully');
  }

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
      throw new Error(
        'Request not found or you do not have permission to update it',
      );
    }

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

  async deleteOffDayRequest(userId: string, requestId: string) {
    const existingRequest = await this.prisma.timeOffRequest.findUnique({
      where: { id: requestId },
    });

    if (!existingRequest || existingRequest.userId !== userId) {
      throw new Error(
        'Request not found or you do not have permission to delete it',
      );
    }

    await this.prisma.timeOffRequest.delete({
      where: { id: requestId },
    });

    return successResponse(null, 'Time off request deleted successfully');
  }
}
