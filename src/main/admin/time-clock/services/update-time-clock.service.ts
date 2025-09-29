import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateTimeClockDto } from '../dto/update-time-clock.dto';

@Injectable()
export class UpdateTimeClockService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to update time clock')
  async updateTimeClock(id: string, dto: UpdateTimeClockDto) {
    if (!dto.clockInAt && !dto.clockOutAt) {
      throw new AppError(400, 'Please provide either clockInAt or clockOutAt');
    }

    // Fetch existing record
    const existing = await this.prisma.timeClock.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new AppError(404, 'Time clock record not found');
    }

    // ensure DB already has a clockOutAt
    if (!existing.clockOutAt) {
      throw new AppError(
        400,
        'Clock out time does not exist for this time clock record',
      );
    }

    const updateData: any = {};

    if (dto.clockInAt !== undefined) {
      updateData.clockInAt = new Date(dto.clockInAt).toISOString();
    }

    if (dto.clockOutAt !== undefined) {
      updateData.clockOutAt = new Date(dto.clockOutAt).toDateString();
    }

    const timeClock = await this.prisma.timeClock.update({
      where: { id },
      data: {
        clockInAt: updateData?.clockInAt?.trim()
          ? updateData.clockInAt
          : existing.clockInAt,
        clockOutAt: updateData?.clockOutAt?.trim()
          ? updateData.clockOutAt
          : existing.clockOutAt,
      },
    });

    return successResponse(timeClock, 'Time clock updated successfully');
  }
}
