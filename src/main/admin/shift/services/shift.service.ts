import { Injectable } from '@nestjs/common';
import { ShiftType } from '@prisma/client';
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
      startTime,
      endTime,
      ...shiftData
    } = dto;

    // *decide shift type based on start time and end time
    const shiftType =
      startTime < endTime ? ShiftType.EVENING : ShiftType.AFTERNOON;

    // * check for shift on the same date, if exist then update it
    const existingShift = await this.prisma.shift.findFirst({
      where: {
        startTime: {
          gte: startTime,
          lte: endTime,
        },
        date: dto.date,
      },
    });

    if (existingShift) {
      const updatedShift = await this.prisma.shift.update({
        where: { id: existingShift.id },
        data: {
          ...shiftData,
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

    const shift = await this.prisma.$transaction(async (tx) => {
      // 1. Create Shift
      const shift = await tx.shift.create({
        data: {
          ...shiftData,
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
          users: {
            include: {
              profile: true,
            },
          },
          shiftTask: true,
        },
      });

      // 2. Create ShiftActivity entries
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
