import { Injectable } from '@nestjs/common';
import { UpdateShiftDto } from '../dto/update-shift.dto';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class ShiftLogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.shift.findMany({
      include: {
        users: {
          include: {
            profile: true,
          },
        },
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
      },
    });
  }

  async update(id: string, dto: UpdateShiftDto) {
    const { userIds, ...data } = dto;

    const updateData: any = { ...data };

    if (userIds) {
      updateData.users = {
        set: userIds.map((id) => ({ id })),
      };
    }

    // if (taskIds) {
    //   updateData.shiftTask = {
    //     set: taskIds.map((id) => ({ id })),
    //   };
    // }

    return this.prisma.shift.update({
      where: { id },
      data: updateData,
      include: {
        users: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.shift.delete({
      where: { id },
    });
  }
}
