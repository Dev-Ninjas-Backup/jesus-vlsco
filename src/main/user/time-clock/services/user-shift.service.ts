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
export class UserShiftService {
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

    const { startTime, endTime } = dto;

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
    const date = new Date(startTime);
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const shift = await this.prisma.shift.create({
      data: {
        job: `${projects?.title}` || 'Unknown',
        shiftTitle: `${projects.title} - ${user?.profile?.jobTitle || 'Unknown'}`,
        location: dto.location,
        locationLat: dto.locationLat,
        locationLng: dto.locationLng,
        shiftType,
        shiftStatus: ShiftStatus.DRAFT,
        date: new Date(startTime).toISOString(),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        note: dto.note,
        allDay: true,
        projectId: dto.projectId,
        users: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
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
}
