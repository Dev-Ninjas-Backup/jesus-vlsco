import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetAssignedShiftsDto } from '../dto/get-assigned-shifts.dto';

@Injectable()
export class GetShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get shifts and users')
  async getAssignedUsersOfAProjects(
    projectId: string,
    dto: GetAssignedShiftsDto,
  ): Promise<TResponse<any>> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new AppError(404, 'Project not found');
    }

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

    // 1. Get all users assigned to the project
    const projectUsers = await this.prisma.projectUser.findMany({
      where: { projectId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!projectUsers || projectUsers.length === 0) {
      return successResponse([], 'No project users found');
    }

    // 2. Get all shifts within range for this project, including assigned users
    const shifts = await this.prisma.shift.findMany({
      where: {
        projectId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
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

    // 3. Map users with their respective shifts
    const formatted = projectUsers.map((pu) => {
      const user = pu.user;

      // find shifts where this user is assigned
      const userShifts = shifts.filter((shift) =>
        shift.users.some((u) => u.id === user.id),
      );

      // check availability: if a shift exists for today → busy, else available
      const hasTodayShift = userShifts.some((s) => {
        const shiftDate = new Date(s.date);
        shiftDate.setHours(0, 0, 0, 0);
        return shiftDate.getTime() === today.getTime();
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          isAvailable: !hasTodayShift,
          profile: {
            firstName: user.profile?.firstName ?? '',
            lastName: user.profile?.lastName ?? '',
            profileUrl: user.profile?.profileUrl ?? '',
          },
        },
        project: {
          id: project.id,
          title: project.title,
          location: project.projectLocation,
        },
        shifts: userShifts.map((s) => ({
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
        })),
      };
    });

    return successResponse(formatted, 'Assigned users found successfully');
  }
}
