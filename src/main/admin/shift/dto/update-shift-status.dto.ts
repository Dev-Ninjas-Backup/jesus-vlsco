import { ApiProperty } from '@nestjs/swagger';
import { ShiftStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateShiftStatusDto {
  @ApiProperty({
    enum: [ShiftStatus.APPROVED, ShiftStatus.REJECTED],
    example: ShiftStatus.APPROVED,
  })
  @IsEnum([ShiftStatus.APPROVED, ShiftStatus.REJECTED])
  status: typeof ShiftStatus.APPROVED | typeof ShiftStatus.REJECTED;
}
