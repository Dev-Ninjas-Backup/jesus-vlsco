import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetShiftsLogDto } from '@project/main/admin/shift/dto/get-default-shifts.dto';
import { RequestShiftDto } from './dto/request-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) { }

  async requestShift(
    userId: string,
    projectId: string,
    dto: RequestShiftDto,
  ) {
    console.log(userId, projectId, dto);
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
