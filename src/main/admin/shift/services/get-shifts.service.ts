import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetAssignedShiftsDto } from '../dto/get-assigned-shifts';

@Injectable()
export class GetShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get shifts and users')
  async getAssignedUsersOfAProjects(
    projectId: string,
    dto: GetAssignedShiftsDto,
  ): Promise<TResponse<any>> {
    const from = dto.from;
    const to = dto.to;

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

    // 2. Get all shifts for this project, including assigned users
    const shifts = await this.prisma.shift.findMany({
      where: { projectId },
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

      // * calculate availability of the user for the current time based on shifts
      // const availability = userShifts.reduce((acc, shift) => {
      //   if (
      //     new Date(shift.startTime) <= new Date() &&
      //     new Date(shift.endTime) >= new Date()
      //   ) {
      //     acc++;
      //   }
      //   return acc;
      // })

      return {
        user: {
          id: user.id,
          email: user.email,
          profile: {
            firstName: user.profile?.firstName ?? '',
            lastName: user.profile?.lastName ?? '',
            profileUrl: user.profile?.profileUrl ?? '',
          },
        },
        shifts: userShifts.map((s) => ({
          id: s.id,
          date: s.date,
          startTime: s.startTime,
          endTime: s.endTime,
          shiftStatus: s.shiftStatus,
        })),
      };
    });

    return successResponse(formatted, 'Team found successfully');
  }
}
