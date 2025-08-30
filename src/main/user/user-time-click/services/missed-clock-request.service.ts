import { Injectable } from '@nestjs/common';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class MissedClockRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async getMissedClockRequests(): Promise<TResponse<any>> {
    // return this.prisma.missedClockRequest.findMany({
    //   where: {
    //     userId,
    //   },
    // });
    return successResponse(
      null,
      'Missed clock requests retrieved successfully',
    );
  }
}
