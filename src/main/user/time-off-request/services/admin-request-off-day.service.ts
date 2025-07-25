import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { AdminRequestOffDayStatusDto } from '../dto/admin-off-day-request.dto';

@Injectable()
export class AdminRequestOffDayService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get all off day requests')
  async getAllOffDayRequests() {
    const requests = await this.prisma.timeOffRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(
      requests,
      'All off day requests retrieved successfully',
    );
  }

  @HandleError('Failed to update off day request')
  async updateOffDayRequest(
    requestId: string,
    dto: AdminRequestOffDayStatusDto,
  ) {
    const { status } = dto;

    const existingRequest = await this.prisma.timeOffRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!existingRequest) {
      throw new AppError(404, 'Request not found');
    }

    const updatedRequest = await this.prisma.timeOffRequest.update({
      where: { id: requestId },
      data: { status },
    });

    // * todo: send notification to the user (who created the request)

    return successResponse(
      updatedRequest,
      'Off day request updated successfully',
    );
  }
}
