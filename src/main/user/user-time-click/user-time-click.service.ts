import { Injectable } from '@nestjs/common';
import { ShiftStatus, ShiftType } from '@prisma/client';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { RequestShiftDto } from './dto/request-shift.dto';

@Injectable()
export class UserTimeClickService {
  constructor(private readonly prisma: PrismaService) { }

  @HandleError('Failed to request a shift')
  async requestAShift(dto: RequestShiftDto, userId: string): Promise<TResponse<any>> {
    const projects = await this.prisma.project.findUnique({
      where: {
        id: dto.projectId,
      },
      include: {
        tasks: true
      }
    });

    if (!projects) {
      throw new AppError(404, 'Project not found');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true
      }
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const shift = await this.prisma.shift.create({
      data: {
        job: user?.profile?.jobTitle || 'Unknown',
        location: user?.profile?.city || 'Unknown',
        shiftTitle: ShiftType.MORNING,
        shiftStatus: ShiftStatus.DRAFT,
        startTime: dto.startTime,
        endTime: dto.endTime,
        note: dto.note,
        date: dto.startTime,
        allDay: true,
        shiftTask: {
          connect: projects?.tasks?.map((task) => ({
            id: task.id,
          })),
        }
      },
    });

    return successResponse(shift, 'Time clock created successfully');
  }

  // * this is time clock
  async getAllShifts() { }

  // * submit time clock (as payroll entry)
  async submitTimeClock() { }

  // * get all payrolls
  async getAllPayrolls() { }
}
