import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class ClockHistoryService {
  constructor(private prisma: PrismaService) {}

  @HandleError("Failed to get user's clock history")
  async getUserHistory(userId: string): Promise<TResponse<any>> {
    const records = await this.prisma.timeClock.findMany({
      where: { userId },
      include: {
        shift: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Flatten into timeline events
    const history = records.flatMap((record) => {
      const events: any[] = [];

      if (record.clockInAt) {
        events.push({
          type: 'CLOCK_IN',
          title: 'You clocked in',
          time: record.clockInAt,
          location: record.shift?.location,
          lat: record.shift?.locationLat,
          lng: record.shift?.locationLng,
          shiftId: record.shift?.id,
          shiftTitle: record.shift?.shiftTitle,
          date: record.shift?.date,
        });
      }

      if (record.clockOutAt) {
        events.push({
          type: 'CLOCK_OUT',
          title: 'You clocked out',
          time: record.clockOutAt,
          location: record.shift?.location,
          lat: record.shift?.locationLat,
          lng: record.shift?.locationLng,
          shiftId: record.shift?.id,
          shiftTitle: record.shift?.shiftTitle,
        });
      }

      return events;
    });

    // Sort by time (latest first)
    const sortedHistory = history.sort(
      (a, b) => b.time.getTime() - a.time.getTime(),
    );

    return successResponse(
      sortedHistory,
      'Clock history retrieved successfully',
    );
  }
}
