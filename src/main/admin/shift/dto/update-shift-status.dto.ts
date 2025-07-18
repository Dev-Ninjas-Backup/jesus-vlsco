import { ApiProperty } from '@nestjs/swagger';
import { ShiftStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateShiftStatusDto {
  @ApiProperty({ enum: ShiftStatus, example: ShiftStatus.APPROVED })
  @IsEnum(ShiftStatus)
  status: ShiftStatus;
}
