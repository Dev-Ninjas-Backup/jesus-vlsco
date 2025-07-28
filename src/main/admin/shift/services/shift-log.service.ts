import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { EVENT_TYPES, ShiftEvent } from '@project/common/interface/events';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { Queue } from 'bullmq';
import { GetShiftsLogDto } from '../dto/get-default-shifts.dto';
import { RequestShiftDto } from '../dto/request-shift.dto';
import { UpdateShiftStatusDto } from '../dto/update-shift-status.dto';

@Injectable()
export class ShiftLogService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('shift')
    private readonly shiftQueue: Queue<ShiftEvent>,
  ) { }

  @HandleError('Error assigning shift to employee')
  async assignShiftToEmployee(
    projectId: string,
    userId: string,
    dto: RequestShiftDto,
  ): Promise<TResponse<any>> {
    const result = await this.prisma.shiftLog.create({
      data: {
        ...dto,
        projectId,
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

  @HandleError('Error approving or rejecting shift change request')
  async updateRequestedShiftStatus(
    shiftLogId: string,
    dto: UpdateShiftStatusDto,
  ): Promise<TResponse<any>> {
    const result = await this.prisma.shiftLog.update({
      where: {
        id: shiftLogId,
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

  @HandleError('Error getting all shifts logs')
  async getAllShiftsLogs(projectId: string, userId: string, query: GetShiftsLogDto): Promise<TPaginatedResponse<any>> {
    const { startTime, endTime, shiftType, status } = query;
    const take = query.limit || 10;
    const page = query.page || 1;
    const skip = page >= 1 ? (page - 1) * take : 0;
    const limit = take > 100 ? 100 : take;

    const filters: Prisma.DefaultShiftWhereInput = {
      projectId,
      ...(startTime && {
        startTime: {
          gte: startTime,
        },
      }),
      ...(endTime && {
        endTime: {
          lte: endTime,
        },
      }),
      ...(shiftType && {
        shiftType,
      }),
      ...(status && {
        status,
      }),
    };

    const [total, data] = await this.prisma.$transaction([
      this.prisma.defaultShift.count({
        where: filters,
      }),
      this.prisma.defaultShift.findMany({
        where: filters,
        include: {
          user: true,
          project: true,
        },
        skip,
        take: limit,
        orderBy: {
          startTime: 'asc',
        },
      }),
    ]);

    return successPaginatedResponse(data, {
      page,
      limit,
      total,
    }, 'Shift found successfully');
  }
}
