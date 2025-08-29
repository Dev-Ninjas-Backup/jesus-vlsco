import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ShiftType } from '@prisma/client';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { EVENT_TYPES } from '@project/common/interface/events-name';
import { ShiftEvent } from '@project/common/interface/events-payload';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateShiftDto } from '../dto/create-shift.dto';

@Injectable()
export class AssignShiftService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @HandleError('Unable to assign shift')
  async create(dto: CreateShiftDto): Promise<TResponse<any>> {
    const {
      userIds = [],
      // taskIds = [],
      date,
      currentProjectId,
      startTime,
      endTime,
      ...shiftData
    } = dto;

    if (!currentProjectId) {
      throw new AppError(400, 'Project ID is required');
    }

    // * Ensure endTime is after startTime (single day shift only)
    if (new Date(endTime) <= new Date(startTime)) {
      throw new AppError(400, 'Shift end time must be after start time');
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start.toDateString() !== end.toDateString()) {
      throw new AppError(400, 'Shift must start and end on the same day');
    }

    // * Decide shift type based on time
    const shiftType =
      new Date(startTime).getHours() < 12
        ? ShiftType.MORNING
        : ShiftType.AFTERNOON;

    // * Get start and end of day
    const now = new Date(date);
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // * Check if a shift already exists on the same date for these users
    const existingShift = await this.prisma.shift.findFirst({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        users: { some: { id: { in: userIds } } },
      },
      orderBy: { startTime: 'asc' },
    });

    let shift;
    let eventType: string;

    if (existingShift) {
      shift = await this.prisma.shift.update({
        where: { id: existingShift.id },
        data: {
          ...shiftData,
          date: new Date(date).toISOString(),
          startTime,
          endTime,
          shiftType,
          users: userIds.length
            ? { set: [], connect: userIds.map((id) => ({ id })) }
            : undefined,
          projectId: currentProjectId,
        },
        include: {
          users: { include: { profile: true } },
          shiftTask: true,
        },
      });

      eventType = EVENT_TYPES.URGENT_SHIFT_CHANGED;
    } else {
      shift = await this.prisma.shift.create({
        data: {
          ...shiftData,
          date: new Date(date).toISOString(),
          startTime,
          endTime,
          shiftType,
          projectId: currentProjectId,
          users: userIds.length
            ? { connect: userIds.map((id) => ({ id })) }
            : undefined,
        },
        include: {
          users: { include: { profile: true } },
          shiftTask: true,
        },
      });

      eventType = EVENT_TYPES.SHIFT_ASSIGN;
    }

    // build payload once
    const payload: ShiftEvent = {
      action:
        eventType === EVENT_TYPES.SHIFT_ASSIGN
          ? 'ASSIGN'
          : 'URGENT_SHIFT_CHANGED',
      meta: {
        date: new Date(date).toISOString(),
        shiftId: shift.id,
        userId: dto.userIds[0],
        performedBy: 'SYSTEM',
        status:
          eventType === EVENT_TYPES.SHIFT_ASSIGN
            ? 'ASSIGNED'
            : 'URGENT_SHIFT_CHANGED',
      },
    };

    this.eventEmitter.emit(eventType, payload);

    return successResponse(
      shift,
      existingShift
        ? 'Shift updated successfully'
        : 'Shift assigned successfully',
    );
  }
}
