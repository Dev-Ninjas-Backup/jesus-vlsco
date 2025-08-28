import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class ClockReportingService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to request overtime of a clock', 'CLOCK_REPORTING')
  async requestOvertimeOfAClock(
    userId: string,
    clockId: string,
  ): Promise<TResponse<any>> {
    const clock = await this.prisma.timeClock.findUnique({
      where: {
        id: clockId,
        userId,
      },
    });

    if (!clock) {
      throw new AppError(404, 'Clock not found');
    }

    // * Check if the clock has overtime already
    if (!clock.overtimeHours) {
      throw new AppError(400, 'Clock has no overtime');
    }

    // * Check if overtime is already allowed
    if (clock.isOvertimeAllowed) {
      throw new AppError(400, 'Overtime already allowed');
    }

    // * Create request
    const request = await this.prisma.requestOverTime.create({
      data: {
        timeClockId: clockId,
        userId,
        reason: 'Overtime',
      },
    });

    return successResponse(request, 'Overtime request created successfully');
  }

  @HandleError('Failed to get overtime requests', 'CLOCK_REPORTING')
  async getOvertimeRequests(userId: string) {
    const requests = await this.prisma.requestOverTime.findMany({
      where: { userId },
      include: { timeClock: true },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(
      requests,
      'Overtime requests retrieved successfully',
    );
  }
}
