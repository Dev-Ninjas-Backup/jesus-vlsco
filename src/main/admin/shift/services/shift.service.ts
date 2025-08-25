import { Injectable } from '@nestjs/common';
import { ShiftType } from '@prisma/client';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateShiftDto } from '../dto/create-shift.dto';
import { UpdateShiftDto } from '../dto/update-shift.dto';

@Injectable()
export class ShiftLogService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Unable to assign shift')
  async create(dto: CreateShiftDto): Promise<TResponse<any>> {
    const {
      userIds = [],
      taskIds = [],
      date,
      startTime,
      endTime,
      ...shiftData
    } = dto;

    // * Ensure endTime is after startTime (single day shift only)
    if (new Date(endTime) <= new Date(startTime)) {
      throw new AppError(404, 'Shift must start and end on the same day');
    }

    // * Decide shift type based on time
    const shiftType =
      new Date(startTime).getHours() < 12
        ? ShiftType.MORNING
        : ShiftType.AFTERNOON;

    // * Check if a shift already exists on the same date
    const existingShift = await this.prisma.shift.findFirst({
      where: {
        date: date.toISOString(),
      },
    });

    if (existingShift) {
      // ✅ Update the existing shift instead of creating another
      const updatedShift = await this.prisma.shift.update({
        where: { id: existingShift.id },
        data: {
          ...shiftData,
          date: date.toISOString(),
          startTime,
          endTime,
          shiftType,
          users: userIds.length
            ? { set: [], connect: userIds.map((id) => ({ id })) }
            : undefined,
          shiftTask: taskIds.length
            ? { set: [], connect: taskIds.map((id) => ({ id })) }
            : undefined,
        },
        include: {
          users: {
            include: {
              profile: true,
            },
          },
          shiftTask: true,
        },
      });
      return successResponse(updatedShift, 'Shift updated successfully');
    }

    // * Otherwise create new shift
    const shift = await this.prisma.$transaction(async (tx) => {
      const shift = await tx.shift.create({
        data: {
          ...shiftData,
          date: date.toISOString(),
          startTime,
          endTime,
          shiftType,
          users: userIds.length
            ? { connect: userIds.map((id) => ({ id })) }
            : undefined,
          shiftTask: taskIds.length
            ? { connect: taskIds.map((id) => ({ id })) }
            : undefined,
        },
        include: {
          users: { include: { profile: true } },
          shiftTask: true,
        },
      });

      if (userIds.length && taskIds.length) {
        const shiftActivities = userIds.flatMap((userId) =>
          taskIds.map((taskId) => ({
            date: dto.date,
            userId,
            taskId,
            shiftId: shift.id,
            content: `${dto.shiftTitle} - Auto generated`,
          })),
        );
        await tx.shiftActivity.createMany({ data: shiftActivities });
      }

      return shift;
    });

    return successResponse(shift, 'Shift assigned successfully');
  }

  async findAll() {
    return this.prisma.shift.findMany({
      include: {
        users: {
          include: {
            profile: true,
          },
        },
        shiftTask: true,
        shiftActivity: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.shift.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            profile: true,
          },
        },
        shiftTask: true,
        shiftActivity: true,
      },
    });
  }

  async update(id: string, dto: UpdateShiftDto) {
    const { userIds, taskIds, ...data } = dto;

    const updateData: any = { ...data };

    if (userIds) {
      updateData.users = {
        set: userIds.map((id) => ({ id })),
      };
    }

    if (taskIds) {
      updateData.shiftTask = {
        set: taskIds.map((id) => ({ id })),
      };
    }

    return this.prisma.shift.update({
      where: { id },
      data: updateData,
      include: {
        users: {
          include: {
            profile: true,
          },
        },
        shiftTask: true,
        shiftActivity: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.shift.delete({
      where: { id },
    });
  }
}
