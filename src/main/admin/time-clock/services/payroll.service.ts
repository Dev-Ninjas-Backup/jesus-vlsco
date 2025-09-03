import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { ClockSheetService } from '@project/main/user/user-time-click/services/clock-sheet.service';

@Injectable()
export class PayrollService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clockSheetService: ClockSheetService,
  ) {}

  @HandleError('Failed to get payroll entries', 'Payroll Entries')
  async getPayRollEntries(pg: PaginationDto): Promise<TPaginatedResponse<any>> {
    const page = pg.page && pg.page > 0 ? pg.page : 1;
    const limit = pg.limit && pg.limit > 0 ? pg.limit : 10;
    const skip = (page - 1) * limit;

    const [totalCount, payrollEntries] = await this.prisma.$transaction([
      this.prisma.payrollEntries.count(),
      this.prisma.payrollEntries.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      }),
    ]);

    // Map payroll entries to include formatted profile info
    const formattedEntries = payrollEntries.map((entry) => {
      const profile = entry.user?.profile;
      const firstName = profile?.firstName || 'N/A';
      const lastName = profile?.lastName || 'User';
      const profileUrl =
        profile?.profileUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}`;

      return {
        ...entry,
        user: {
          ...entry.user,
          profile: {
            firstName,
            lastName,
            profileUrl,
          },
        },
      };
    });

    return successPaginatedResponse(
      formattedEntries,
      { page, limit, total: totalCount },
      'Payroll Entries retrieved successfully',
    );
  }

  @HandleError('Failed to get payroll entry', 'Payroll Entry')
  async getPayRollEntryById(id: string): Promise<TResponse<any>> {
    const payroll = await this.prisma.payrollEntries.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    const userId = payroll?.userId;

    if (!userId) {
      return successResponse(null, 'Payroll Entry found successfully');
    }

    const from = new Date(payroll?.startDate || '');
    const to = new Date(payroll?.endDate || '');

    const payrollSheet = await this.clockSheetService.getMyClockSheet(userId, {
      from,
      to,
    });

    return successResponse(
      {
        payroll,
        payrollSheet: payrollSheet.data,
      },
      'Payroll Entry found successfully',
    );
  }

  @HandleError('Failed to delete payroll entry', 'Payroll Entry')
  async deletePayrollEntryById(id: string): Promise<TResponse<any>> {
    const payroll = await this.prisma.payrollEntries.delete({
      where: { id },
    });
    return successResponse(payroll, 'Payroll Entry deleted successfully');
  }

  @HandleError('Failed to update payroll entry', 'Payroll Entry')
  async acceptOrRejectPayrollEntryById(
    id: string,
    accept: boolean,
  ): Promise<TResponse<any>> {
    const payroll = await this.prisma.payrollEntries.update({
      where: { id },
      data: {
        status: accept ? 'APPROVED' : 'REJECTED',
      },
    });
    return successResponse(payroll, 'Payroll Entry updated successfully');
  }
}
