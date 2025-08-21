import { Injectable } from '@nestjs/common';
import { ShiftStatus, ShiftType } from '@prisma/client';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { RequestShiftDto } from '../dto/request-shift.dto';

@Injectable()
export class UserTimeClickService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to request a shift')
  async requestAShift(
    dto: RequestShiftDto,
    userId: string,
  ): Promise<TResponse<any>> {
    const projects = await this.prisma.project.findUnique({
      where: {
        id: dto.projectId,
        // * ensure it has at least one not done d=task
        tasks: {
          some: {
            status: {
              not: 'DONE',
            },
          },
        },
      },
      include: {
        tasks: true,
      },
    });

    if (!projects) {
      throw new AppError(404, 'Project has no active tasks');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const shift = await this.prisma.shift.create({
      data: {
        job: `${projects?.title}` || 'Unknown',
        shiftTitle: `${projects.title} - ${user?.profile?.jobTitle || 'Unknown'}`,
        location: dto.location,
        locationLat: dto.locationLat,
        locationLng: dto.locationLng,
        shiftType:
          dto.startTime < dto.endTime ? ShiftType.EVENING : ShiftType.AFTERNOON,
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
        },
        users: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        shiftTask: true,
        users: {
          include: {
            profile: true,
          },
        },
      },
    });

    return successResponse(shift, 'Shift request sent successfully');
  }

  @HandleError('Failed to get all shifts')
  async getAllShifts(pg: PaginationDto, userId: string) {
    const page = pg.page && pg.page > 0 ? pg.page : 1;
    const limit = pg.limit && pg.limit > 0 ? pg.limit : 10;
    const skip = (page - 1) * limit;

    const shifts = await this.prisma.shift.findMany({
      include: {
        shiftTask: true,
        users: {
          where: { id: userId },
          include: {
            profile: true,
          },
        },
      },
      where: {
        shiftStatus: {
          equals: ShiftStatus.DRAFT,
        },
        users: {
          some: { id: userId },
        },
      },
      skip,
      take: limit,
    });

    // Transform into a structured response
    const formatted = shifts.map((shift) => ({
      id: shift.id,
      shiftTitle: shift.shiftTitle,
      status: shift.shiftStatus,
      startTime: shift.startTime,
      endTime: shift.endTime,
      note: shift.note,
      tasks: shift.shiftTask.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
      })),
      user:
        shift.users.length > 0
          ? {
              id: shift.users[0].id,
              email: shift.users[0].email,
              profile: {
                id: shift.users[0].profile?.id,
                firstName: shift.users[0].profile?.firstName,
                lastName: shift.users[0].profile?.lastName,
                profileUrl: shift.users[0].profile?.profileUrl,
                initials: shift.users[0].profile
                  ? `${shift.users[0].profile.firstName?.[0] ?? ''}${shift.users[0].profile.lastName?.[0] ?? ''}`
                  : null,
              },
            }
          : null,
    }));

    return successResponse(
      {
        page,
        limit,
        count: formatted.length,
        data: formatted,
      },
      'Shifts retrieved successfully',
    );
  }

  @HandleError('Failed to cancel shift request')
  async cancelAShiftRequestIfAlreadyNotApproved(shiftId: string) {
    const shift = await this.prisma.shift.findUnique({
      where: { id: shiftId },
    });

    if (!shift) {
      throw new AppError(404, 'Shift not found');
    }

    if (shift && shift.shiftStatus !== ShiftStatus.PUBLISHED) {
      await this.prisma.shift.delete({ where: { id: shiftId } });

      return successResponse(null, 'Shift request cancelled successfully');
    }

    return successResponse(null, 'Shift request already approved');
  }

  // * submit time clock (as payroll entry)
  async submitTimeClock() {}

  // * get all payrolls
  async getAllPayrolls() {}
}
