import { ApiProperty } from '@nestjs/swagger';
import { TimeOffRequestStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class AdminRequestOffDayStatusDto {
  @ApiProperty({
    description: 'Status of the request',
    enum: TimeOffRequestStatus,
    example: TimeOffRequestStatus.PENDING,
  })
  @IsEnum([
    TimeOffRequestStatus.PENDING,
    TimeOffRequestStatus.APPROVED,
    TimeOffRequestStatus.REJECTED,
  ])
  status: TimeOffRequestStatus;
}
