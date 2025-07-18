import { Injectable } from '@nestjs/common';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { ChangeShiftDto } from '../dto/change-shift.dto';
import { RequestShiftDto } from '../dto/request-shift.dto';
import { UpdateShiftStatusDto } from '../dto/update-shift-status.dto';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async assignShiftToEmployee(
    userId: string,
    dto: RequestShiftDto,
  ): Promise<TResponse<any>> {
    const result = await this.prisma.shift.create({
      data: {
        ...dto,
        userId,
        status: 'APPROVED', // * IMPORTANT: This is always approved
      },
    });
    // * TODO: send notification to the user

    return successResponse(result, 'Shift assigned successfully');
  }

  async updateShiftStatus(
    shiftId: string,
    dto: UpdateShiftStatusDto,
  ): Promise<TResponse<any>> {
    const result = await this.prisma.shift.update({
      where: {
        id: shiftId,
      },
      data: {
        status: dto.status,
      },
      include: {
        user: true,
      },
    });

    // * TODO: send notification to the user

    const message = dto.status === 'APPROVED' ? 'Approved' : 'Rejected';
    return successResponse(result, `Shift ${message} successfully`);
  }

  async changeShift(
    shiftId: string,
    dto: ChangeShiftDto,
  ): Promise<TResponse<any>> {
    const result = await this.prisma.shift.update({
      where: {
        id: shiftId,
      },
      data: {
        ...dto,
      },
      include: {
        user: true,
      },
    });

    // * TODO: send notification to the user

    return successResponse(result, 'Shift updated successfully');
  }
}
