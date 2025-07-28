import { ApiProperty } from '@nestjs/swagger';
import { ShiftType } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, Min } from 'class-validator';

export class CreateDefaultShiftDto {
  @ApiProperty({ enum: ShiftType, example: ShiftType.EVENING })
  @IsEnum(ShiftType)
  shiftType: ShiftType;

  @ApiProperty({ example: 6 })
  @IsInt()
  @Min(1)
  shiftDuration: number;

  @ApiProperty({ example: '2025-07-20T14:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2025-07-20T20:00:00Z' })
  @IsDateString()
  endTime: string;
}
