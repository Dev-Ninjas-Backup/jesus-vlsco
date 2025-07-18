import { ApiProperty } from '@nestjs/swagger';
import { ShiftStatus } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class UpdateShiftStatusDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  shiftId: string;

  @ApiProperty({ enum: ShiftStatus, example: ShiftStatus.APPROVED })
  @IsEnum(ShiftStatus)
  status: ShiftStatus;
}
