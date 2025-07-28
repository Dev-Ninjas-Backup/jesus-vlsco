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
  ) {
    console.log(userId, dto);
  }

  async updateDefaultShiftRequest(
    userId: string,
    requestId: string,
    dto: UpdateShiftRequestDto,
  ) {
    console.log(userId, requestId, dto);
  }

  async cancelDefaultShiftRequest(userId: string, requestId: string) {
    console.log(userId, requestId);
  }

  async getDefaultShift(id: string) {
    console.log(id);
  }

  async getDefaultShifts(query: any) {
    console.log(query);
  }

  async requestAShiftChange(userId: string, dto: RequestAShiftChangeDto) {
    console.log(userId, dto);
  }

  async updateShiftRequest(
    userId: string,
    requestId: string,
    dto: UpdateShiftRequestDto,
  ) {
    console.log(userId, requestId, dto);
  }

  async cancelShiftRequest(userId: string, requestId: string) {
    console.log(userId, requestId);
  }

  async getShift(id: string) {
    console.log(id);
  }

  async getShifts(query: any) {
    console.log(query);
  }
}
