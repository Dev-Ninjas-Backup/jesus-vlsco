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

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {}

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
      }),
    ]);

    return successPaginatedResponse(
      payrollEntries,
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

    return successResponse(payroll, 'Payroll Entry found successfully');
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
