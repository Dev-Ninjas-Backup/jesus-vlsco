import { Injectable } from '@nestjs/common';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {}

  async deletePayroll(userId: string): Promise<TResponse<any>> {
    const payroll = await this.prisma.payroll.delete({
      where: {
        userId,
      },
    });
    return successResponse(payroll, 'Payroll deleted successfully');
  }
}
