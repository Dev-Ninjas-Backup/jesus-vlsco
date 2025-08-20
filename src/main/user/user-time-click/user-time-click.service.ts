import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class UserTimeClickService {
  constructor(private readonly prisma: PrismaService) {}

  async requestAShift() {}

  // * this is time clock
  async getAllShifts() {}

  // * submit time clock (as payroll entry)
  async submitTimeClock() {}

  // * get all payrolls
  async getAllPayrolls() {}
}
