import { Injectable } from '@nestjs/common';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateOffdayBreakDto, UpdatePayrollRateDto } from '../dto/payroll.dto';
import { HandleError } from '@project/common/error/handle-error.decorator';

@Injectable()
export class AddPayrollService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError("Pay rate & leave can't be updated")
  async updatePayRate(
    userId: string,
    dto: UpdatePayrollRateDto,
  ): Promise<TResponse<any>> {
    const payroll = await this.prisma.payroll.upsert({
      where: { userId },
      create: {
        userId,
        ...dto,
      },
      update: {
        regularPayRate: dto.regularPayRate,
        regularPayRateType: dto.regularPayRateType,
        overTimePayRate: dto.overTimePayRate,
        overTimePayRateType: dto.overTimePayRateType,
        casualLeave: dto.casualLeave,
        sickLeave: dto.sickLeave,
      },
    });

    return successResponse(payroll, 'Pay rate & leave updated successfully');
  }

  @HandleError("Offday & Break can't be updated")
  async updateOffdayBreak(
    userId: string,
    dto: UpdateOffdayBreakDto,
  ): Promise<TResponse<any>> {
    const payroll = await this.prisma.payroll.upsert({
      where: { userId },
      create: {
        userId,
        ...dto,
      },
      update: {
        numberOffDay: dto.numberOffDay,
        offDay: dto.offDay,
        breakTimePerDay: dto.breakTimePerDay,
      },
    });

    return successResponse(payroll, 'Offday & Break updated successfully');
  }
}
