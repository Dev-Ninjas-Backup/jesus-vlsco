import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetAssignedShiftsDto } from '@project/main/admin/shift/dto/get-assigned-shifts.dto';

@Injectable()
export class GetShiftScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Error getting shift schedule')
  async getUserShiftSchedule(
    userId: string,
    dto: GetAssignedShiftsDto,
  ): Promise<TResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, payroll: true },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const projectUsers = await this.prisma.projectUser.findMany({
      where: { userId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        project: true,
      },
    });

    // * both are optional , default is current week
    let { startDate, endDate } = dto;

    const today = new Date();
    if (!startDate || !endDate) {
      // default: current week (Mon → Sun)
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Sunday = 0
      firstDayOfWeek.setHours(0, 0, 0, 0);

      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      lastDayOfWeek.setHours(23, 59, 59, 999);

      startDate = startDate ?? firstDayOfWeek;
      endDate = endDate ?? lastDayOfWeek;
    }

    const projectIds = projectUsers.map((projectUser) => projectUser.projectId);

    const shifts = await this.prisma.shift.findMany({
      where: {
        projectId: { in: projectIds },
        users: { some: { id: userId } },
      },
      include: {
        project: true,
        shiftTask: true,
      },
    });

    // check availability: if a shift exists for today → busy, else available
    const hasTodayShift = shifts.some((s) => {
      const shiftDate = new Date(s.date);
      shiftDate.setHours(0, 0, 0, 0);
      return shiftDate.getTime() === today.getTime();
    });

    const projectWithShifts = projectUsers.map((pu) => {
      const projectShifts = shifts
        .filter((s) => s.projectId === pu.projectId)
        .map((s) => ({
          id: s.id,
          title: s.shiftTitle,
          projectId: s.projectId,
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          shiftStatus: s.shiftStatus,
          location: s.location,
          lat: s.locationLat,
          lng: s.locationLng,
        }));

      return {
        project: {
          id: pu.project.id,
          title: pu.project.title,
          location: pu.project.projectLocation,
        },
        shifts: projectShifts,
      };
    });

    const outPutData = {
      user: {
        id: user.id,
        email: user.email,
        isAvailable: !hasTodayShift,
        firstName: user.profile?.firstName ?? '',
        lastName: user.profile?.lastName ?? '',
        profileUrl: user.profile?.profileUrl ?? '',
        offDay: user.payroll?.offDay ?? ['SUNDAY'],
      },
      projectWithShifts,
    };

    return successResponse(outPutData, 'Shift schedule retrieved successfully');
  }
}
