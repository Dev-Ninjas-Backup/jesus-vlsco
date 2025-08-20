import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class TimeClockService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Unable to create time clock')
  async responseToShiftRequest(): Promise<TResponse<any>> {
    return successResponse(null, 'Time clock created successfully');
  }

  async responseToPayrollEntryRequest() {}

  async getAllPayrolls() {}

  async getAllAApprovedShiftsByByAllUsers() {}

  async getAllPendingShiftsByAllUsers() {}

  // * get time clock of a user
  async getAllShiftsOfAUser() {}
}
