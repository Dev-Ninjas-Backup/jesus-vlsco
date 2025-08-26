import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { ApproveOrRejectShiftRequest } from './dto/time-clock.dto';

@Injectable()
export class TimeClockService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Unable to get all pending shifts by all users')
  async getAllPendingShiftsByAllUsers(pg: PaginationDto) {
    const page = pg.page && pg.page > 0 ? pg.page : 1;
    const limit = pg.limit && pg.limit > 0 ? pg.limit : 10;
    const skip = (page - 1) * limit;

    const shifts = await this.prisma.shift.findMany({
      where: {
        shiftStatus: 'DRAFT',
      },
      include: {
        users: {
          include: {
            profile: true,
          },
        },
      },
      skip,
      take: limit,
    });

    return successResponse(shifts, 'Shifts found successfully');
  }

  @HandleError('Unable to get all pending shifts by all users')
  async approveOrRejectShiftRequest(
    dto: ApproveOrRejectShiftRequest,
    shiftId: string,
  ) {
    const shift = await this.prisma.shift.findUnique({
      where: { id: shiftId },
    });

    if (!shift) {
      throw new AppError(404, 'Shift not found');
    }

    if (shift.shiftStatus !== 'DRAFT') {
      throw new AppError(400, 'Shift is not in draft status');
    }

    await this.prisma.shift.update({
      where: { id: shiftId },
      data: { shiftStatus: dto.isApproved ? 'PUBLISHED' : 'REJECTED' },
    });

    return successResponse(
      null,
      `Shift request ${dto.isApproved ? 'approved' : 'rejected'} successfully`,
    );
  }
}
