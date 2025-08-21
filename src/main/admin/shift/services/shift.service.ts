import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateShiftDto } from '../dto/create-shift.dto';
import { UpdateShiftDto } from '../dto/update-shift.dto';

@Injectable()
export class ShiftLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateShiftDto) {
    const { userIds = [], taskIds = [], ...shiftData } = dto;

    return await this.prisma.$transaction(async (tx) => {
      // 1. Create Shift
      const shift = await tx.shift.create({
        data: {
          ...shiftData,
          users: userIds.length
            ? { connect: userIds.map((id) => ({ id })) }
            : undefined,
          shiftTask: taskIds.length
            ? { connect: taskIds.map((id) => ({ id })) }
            : undefined,
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
