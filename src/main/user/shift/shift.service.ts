import { Injectable } from '@nestjs/common';
import { ShiftType } from '@prisma/client';
import { successResponse, TResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetShiftsLogDto } from '@project/main/admin/shift/dto/get-default-shifts.dto';
import dayjs from 'dayjs';
import { RequestShiftDto } from './dto/request-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) { }

  async requestShift(
    userId: string,
    projectId: string,
    dto: RequestShiftDto,
  ): Promise<TResponse<any>> {
    const { startDate, endDate, startTime, endTime, managerNote } = dto;

    const parsedStartDate = dayjs(startDate);
    const parsedEndDate = dayjs(endDate);

    if (!parsedStartDate.isValid() || !parsedEndDate.isValid()) {
      throw new Error('Invalid start or end date');
    }

    if (parsedStartDate.isAfter(parsedEndDate)) {
      throw new Error('startDate must not be after endDate');
    }

    const sampleStart = dayjs(`2000-01-01T${startTime}`);
    const sampleEnd = dayjs(`2000-01-01T${endTime}`);

    if (!sampleStart.isValid() || !sampleEnd.isValid()) {
      throw new Error('Invalid start or end time');
    }

    const shiftDuration = sampleEnd.diff(sampleStart, 'hour', true);
    if (shiftDuration <= 0) {
      throw new Error('Shift end time must be after start time');
    }

    // Infer shiftType based on start time
    let shiftType = 'MORNING';
    const hour = sampleStart.hour();

    if (hour >= 5 && hour < 12) shiftType = 'MORNING';
    else if (hour >= 12 && hour < 18) shiftType = 'AFTERNOON';
    else if (hour >= 18 || hour < 5) shiftType = 'NIGHT';

    const shiftLogs = [];
    let currentDate = parsedStartDate;

    while (currentDate.diff(parsedEndDate, 'day') <= 0) {
      const fullStart = dayjs(`${currentDate.format('YYYY-MM-DD')}T${startTime}`);
      const fullEnd = dayjs(`${currentDate.format('YYYY-MM-DD')}T${endTime}`);

      shiftLogs.push({
        projectId,
        userId,
        startTime: fullStart.toDate(),
        endTime: fullEnd.toDate(),
        date: currentDate.toDate(),
        shiftType: shiftType as ShiftType,
        shiftDuration,
        managerNote,
      });

      currentDate = currentDate.add(1, 'day');
    }

    const result = await this.prisma.shiftLog.createMany({
      data: shiftLogs,
      skipDuplicates: true, // Optional, prevents inserting duplicate keys if constrained
    });

    return successResponse(result, 'Shift request(s) submitted successfully');
  }


  async updateShiftRequest(
    userId: string,
    requestId: string,
    dto: UpdateShiftDto,
  ) {
    console.log(userId, requestId, dto);
  }

  async cancelShiftRequest(userId: string, requestId: string) {
    console.log(userId, requestId);
  }

  async getShiftLogs(query: GetShiftsLogDto) {
    console.log(query);
  }

  async getShiftLog(id: string) {
    console.log(id);
  }
}
