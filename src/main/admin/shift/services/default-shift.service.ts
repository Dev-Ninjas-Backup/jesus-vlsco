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
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { ChangeShiftDto } from '../dto/change-shift.dto';
import { GetDefaultShiftsDto } from '../dto/get-default-shifts.dto';
dayjs.extend(weekOfYear);

@Injectable()
export class DefaultShiftService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('shift')
    private readonly shiftQueue: Queue<ShiftEvent>,
  ) { }

  @HandleError('Error getting default shift of a user')
  async getDefaultShiftsByProjectId(
    projectId: string,
    query: GetDefaultShiftsDto,
  ): Promise<TPaginatedResponse<any>> {
    const { startTime, endTime, shiftType, dataType } = query;
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

    let transformedData = data;

    if (dataType) {
      const groupBy = (item: any) => {
        const date = dayjs(item.createdAt); // or item.date, shiftDate, etc.
        switch (dataType) {
          case 'daily':
            return date.format('YYYY-MM-DD');
          case 'weekly':
            return `W${date.week()}-${date.year()}`;
          case 'monthly':
            return date.format('YYYY-MM');
        }
      };

      const grouped = new Map<string, any[]>();
      for (const item of data) {
        const key = groupBy(item);
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key)?.push(item);
      }

      transformedData = Array.from(grouped.entries()).flatMap(([key, items]) => {
        return items.map((item) => ({
          ...item,
          project: item.project,
          user: item.user,
        }));
      });
    }

    return successPaginatedResponse(
      transformedData,
      {
        page,
        limit,
        total,
      },
      'Shift found successfully',
    );
  }


  @HandleError('Error updating default shift')
  async changeDefaultShift(
    projectId: string,
    userId: string,
    dto: ChangeShiftDto,
  ): Promise<TResponse<any>> {
    const result = await this.prisma.defaultShift.update({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
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

  @HandleError('Error deleting default shift')
  async deleteDefaultShift(id: string): Promise<TResponse<any>> {
    const result = await this.prisma.defaultShift.delete({
      where: {
        id,
      },
    });

    return successResponse(result, 'Shift deleted successfully');
  }
}
