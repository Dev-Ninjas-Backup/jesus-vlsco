import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class TimeClockService {
  constructor(private readonly prisma: PrismaService) {}

  async responseToShiftRequest() {}

  async responseToPayrollEntryRequest() {}

  async getAllPayrolls() {}

  async getAllAApprovedShiftsByByAllUsers() {}

  async getAllPendingShiftsByAllUsers() {}

  // * get time clock of a user
  async getAllShiftsOfAUser() {}
}
