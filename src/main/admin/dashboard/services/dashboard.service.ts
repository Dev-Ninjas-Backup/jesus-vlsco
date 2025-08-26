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

  @HandleError('Failed to get all notifications')
  async getAllNotifications() {
    const notifications = await this.prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(notifications, 'Notifications fetched successfully');
  }

  @HandleError('Failed to get dashboard data')
  async getDashboardData(): Promise<TResponse<any>> {
    const recognitionNotifications = await this.getRecognitionNotifications();
    const announcementNotifications = await this.getAnnouncementNotifications();
    const shiftNotifications = await this.getShiftNotifications();

    const dashboardData = {
      recognitionNotifications,
      announcementNotifications,
      shiftNotifications,
    };

    return successResponse(
      dashboardData,
      'Dashboard data fetched successfully',
    );
  }

  private async getRecognitionNotifications() {
    const recognitionNotifications = await this.prisma.notification.findMany({
      where: {
        type: 'Recognition',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return recognitionNotifications;
  }

  private async getAnnouncementNotifications() {
    const announcementNotifications = await this.prisma.notification.findMany({
      where: {
        type: 'Announcement',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return announcementNotifications;
  }

  private async getShiftNotifications() {
    const shiftNotifications = await this.prisma.notification.findMany({
      where: {
        type: 'Shift',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return shiftNotifications;
  }
}
