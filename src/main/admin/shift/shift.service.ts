import { Injectable } from '@nestjs/common';
import { CreateShiftDto } from './dto/create-shift.dto';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftType } from '@prisma/client';

@Injectable()
export class ShiftLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateShiftDto) {
  const { userIds = [], taskIds = [], saveAsTemplate, ...shiftData } = dto;

  return this.prisma.$transaction(async (tx) => {
    // 1. Create Shift
    const shift = await tx.shift.create({
      data: {
        ...shiftData,
        users: userIds.length ? { connect: userIds.map((id) => ({ id })) } : undefined,
        shiftTask: taskIds.length ? { connect: taskIds.map((id) => ({ id })) } : undefined,
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
        }))
      );

      await tx.shiftActivity.createMany({ data: shiftActivities });
    }

    // 3. Save as DefaultShift template (if requested)
    if (saveAsTemplate) {
      await tx.defaultShift.upsert({
        where: {
          userId_projectId: {
            userId: dto.currentUserId,
            projectId: dto.currentProjectId,
          },
        },
        create: {
          userId: dto.currentUserId,
          projectId: dto.currentProjectId,
          shiftType: ShiftType.MORNING, // or derive from time
          shiftDuration: Math.floor(
            (new Date(dto.endTime).getTime() - new Date(dto.startTime).getTime()) / (1000 * 60 * 60)
          ),
          startTime: dto.startTime,
          endTime: dto.endTime,
        },
        update: {
          shiftDuration: Math.floor(
            (new Date(dto.endTime).getTime() - new Date(dto.startTime).getTime()) / (1000 * 60 * 60)
          ),
          startTime: dto.startTime,
          endTime: dto.endTime,
        },
      });
    }

    return shift;
  });
}

  async findAll() {
    return this.prisma.shift.findMany({
      include: {
        users: true,
        shiftTask: true,
        shiftActivity: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.shift.findUnique({
      where: { id },
      include: {
        users: true,
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
        users: true,
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
