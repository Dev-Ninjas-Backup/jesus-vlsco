import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetUserShiftsDto } from '../dto/get-user-shifts.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to fetch dashboard')
  async getUserDashboard(userId: string): Promise<TResponse<any>> {
    const upcomingShifts = await this.getUserUpcomingShifts(userId);
    const upcomingTasks = await this.getUserUpcomingTasks(userId);
    const companyUpdates = await this.getCompanyUpdateNotifications(userId);
    const recognitions = await this.getRecognitionsNotifications(userId);
    const urgentShiftChange =
      await this.getUrgentShiftChangeNotifications(userId);

    return successResponse(
      {
        upcomingShifts,
        upcomingTasks,
        companyUpdates,
        recognitions,
        urgentShiftChange,
      },
      'Dashboard fetched successfully',
    );
  }

  @HandleError('Failed to fetch shifts')
  async getAllShiftsAssignedToUser(
    userId: string,
    dto: GetUserShiftsDto,
  ): Promise<TPaginatedResponse<any>> {
    const page = dto.page && dto.page > 0 ? dto.page : 1;
    const limit = dto.limit && dto.limit > 0 ? dto.limit : 20;
    const skip = (page - 1) * limit;

    const searchTerm = dto.searchTerm?.trim();

    const [shifts, totalCount] = await this.prisma.$transaction([
      this.prisma.shift.findMany({
        where: {
          users: { some: { id: userId } },
          shiftStatus: 'PUBLISHED',
          OR: [
            { shiftTitle: { contains: searchTerm } },
            { location: { contains: searchTerm } },
          ],
        },
        skip,
        take: limit,
        orderBy: { startTime: 'asc' },
      }),
      this.prisma.shift.count({
        where: {
          users: { some: { id: userId } },
          shiftStatus: 'PUBLISHED',
          OR: [
            { shiftTitle: { contains: searchTerm } },
            { location: { contains: searchTerm } },
          ],
        },
      }),
    ]);

    return successPaginatedResponse(
      shifts,
      {
        page,
        limit,
        total: totalCount,
      },
      'Shifts fetched successfully',
    );
  }

  @HandleError('Failed to fetch notifications')
  async getUserNotifications(userId: string): Promise<TResponse<any>> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        users: { some: { userId } },
      },
    });

    return successResponse(notifications, 'Notifications fetched successfully');
  }

  // Helpers
  private async getUserUpcomingShifts(userId: string) {
    const shifts = await this.prisma.shift.findMany({
      where: {
        startTime: { gte: new Date() },
        shiftStatus: 'PUBLISHED',
        users: { some: { id: userId } },
      },
      orderBy: { startTime: 'asc' },
    });

    return shifts;
  }

  private async getUserUpcomingTasks(userid: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        startTime: { gte: new Date() },
        tasksUsers: { some: { userId: userid } },
      },
      orderBy: { startTime: 'asc' },
    });

    return tasks;
  }

  async getCompanyUpdateNotifications(userId: string) {
    const companyUpdatesNotifications = await this.prisma.notification.findMany(
      {
        where: {
          type: 'Announcement',
          users: { some: { userId } },
        },
        orderBy: { createdAt: 'desc' },
      },
    );
    return companyUpdatesNotifications;
  }

  async getRecognitionsNotifications(userId: string) {
    const recognitionsNotifications = await this.prisma.notification.findMany({
      where: {
        type: 'Recognition',
        users: { some: { userId } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return recognitionsNotifications;
  }

  async getUrgentShiftChangeNotifications(userId: string) {
    const urgentShiftChangeNotifications =
      await this.prisma.notification.findMany({
        where: {
          type: 'UrgentShiftChanged',
          users: { some: { userId } },
        },
        orderBy: { createdAt: 'desc' },
      });
    return urgentShiftChangeNotifications;
  }
}
