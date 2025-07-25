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
import { RequestShiftDto } from '../dto/request-shift.dto';
import { UpdateShiftStatusDto } from '../dto/update-shift-status.dto';

@Injectable()
export class ShiftService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('shift')
    private readonly shiftQueue: Queue<ShiftEvent>,
  ) {}

  @HandleError('Error assigning shift to employee')
  async assignShiftToEmployee(
    userId: string,
    dto: RequestShiftDto,
  ): Promise<TResponse<any>> {
    const result = await this.prisma.shift.create({
      data: {
        ...dto,
        userId,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        status: 'APPROVED', // * IMPORTANT: This is always approved
      },
    });

    // * Enqueue job
    const payload: ShiftEvent = {
      shiftId: result.id,
      userId,
      action: 'ASSIGN',
      meta: {
        performedBy: userId, // assuming user assigns to self
        date: new Date().toISOString(),
      },
    };

    await this.shiftQueue.add(EVENT_TYPES.SHIFT_ASSIGN, payload);

    return successResponse(result, 'Shift assigned successfully');
  }

  @HandleError('Error updating shift status')
  async updateShiftStatus(
    shiftId: string,
    dto: UpdateShiftStatusDto,
  ): Promise<TResponse<any>> {
    const result = await this.prisma.shift.update({
      where: {
        id: shiftId,
      },
      data: {
        status: dto.status,
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
        status: dto.status,
      },
    };

    await this.shiftQueue.add(EVENT_TYPES.SHIFT_STATUS_UPDATE, payload);

    const message = dto.status === 'APPROVED' ? 'Approved' : 'Rejected';
    return successResponse(result, `Shift ${message} successfully`);
  }

  @HandleError('Error updating shift')
  async changeShift(
    shiftId: string,
    dto: ChangeShiftDto,
  ): Promise<TResponse<any>> {
    const result = await this.prisma.shift.update({
      where: {
        id: shiftId,
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

  @HandleError('Error getting shift by id')
  async getShiftById(shiftId: string): Promise<TResponse<any>> {
    const result = await this.prisma.shift.findUnique({
      where: {
        id: shiftId,
      },
      include: {
        user: true,
      },
    });
    return successResponse(result, 'Shift found successfully');
  }
}
