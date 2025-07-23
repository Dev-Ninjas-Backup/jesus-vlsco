import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateTimeOffRequestDto } from '../dto/off-day-request.dto';
import { successResponse } from '@project/common/utils/response.util';

@Injectable()
export class OffDayRequestService {
    constructor(private readonly prisma:PrismaService) {}

    async createOffDayRequset(dto: CreateTimeOffRequestDto, userId: string) {
        const { startDate, endDate, reason, isFullDayOff, totalDaysOff } = dto;

        const result = await this.prisma.timeOffRequest.create({
            data:{
                startDate,
                endDate,
                reason,
                isFullDayOff,
                totalDaysOff,
                userId,
            }
        })
        return successResponse(result, 'Time off request created successfully');

    }
}
