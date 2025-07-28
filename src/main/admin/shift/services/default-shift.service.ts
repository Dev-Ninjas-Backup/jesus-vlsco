import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { EVENT_TYPES, ShiftEvent } from '@project/common/interface/events';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { Queue } from 'bullmq';
import { ChangeShiftDto } from '../dto/change-shift.dto';

@Injectable()
export class DefaultShiftService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('shift')
    private readonly shiftQueue: Queue<ShiftEvent>,
  ) {}

  @HandleError('Error getting default shift of a user')
  async getDefaultShiftById(userId: string): Promise<TResponse<any>> {
    const result = await this.prisma.defaultShift.findUnique({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
    return successResponse(result, 'Shift found successfully');
  }

  @HandleError('Error updating default shift')
  async changeDefaultShift(
    userId: string,
    dto: ChangeShiftDto,
  ): Promise<TResponse<any>> {
    const result = await this.prisma.defaultShift.update({
      where: {
        userId,
      },
      data: {
        ...dto,
      },
      include: {
        user: true,
      },
    });

    // * Enqueue job
    const payload: ShiftEvent = {
      shiftId: result.id,
      userId: result.userId,
      action: 'STATUS_UPDATE',
      meta: {
        performedBy: result.userId,
        date: new Date().toISOString(),
      },
    };

    await this.shiftQueue.add(EVENT_TYPES.SHIFT_STATUS_UPDATE, payload);

    return successResponse(result, 'Shift updated successfully');
  }
}
