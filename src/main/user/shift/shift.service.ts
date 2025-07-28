import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { RequestAShiftChangeDto } from './dto/request-a-shift-change.dto';
import { RequestDefaultShiftChangeDto } from './dto/request-default-shift-change.dto';
import { UpdateShiftRequestDto } from './dto/update-shift-request.dto';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async requestDefaultShiftChange(
    userId: string,
    dto: RequestDefaultShiftChangeDto,
  ) {}

  async updateDefaultShiftRequest(
    userId: string,
    requestId: string,
    dto: UpdateShiftRequestDto,
  ) {}

  async cancelDefaultShiftRequest(userId: string, requestId: string) {}

  async getDefaultShift(id: string) {}

  async getDefaultShifts(query: any) {}

  async requestAShiftChange(userId: string, dto: RequestAShiftChangeDto) {}

  async updateShiftRequest(
    userId: string,
    requestId: string,
    dto: UpdateShiftRequestDto,
  ) {}

  async cancelShiftRequest(userId: string, requestId: string) {}

  async getShift(id: string) {}

  async getShifts(query: any) {}
}
