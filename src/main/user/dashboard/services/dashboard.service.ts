import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

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
    });

    return shifts;
  }

  private async getUserUpcomingTasks(userid: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        startTime: { gte: new Date() },
        tasksUsers: { some: { userId: userid } },
      },
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
      });
    return urgentShiftChangeNotifications;
  }
}
