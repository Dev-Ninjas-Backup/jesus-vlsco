import { ApiProperty } from '@nestjs/swagger';
import { ShiftType } from '@prisma/client';
import { IsDateString, IsEnum, IsInt, Min } from 'class-validator';

export class RequestShiftDto {
  @ApiProperty({ example: '2025-07-20', description: 'Shift date' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: ShiftType, example: ShiftType.MORNING })
  @IsEnum(ShiftType)
  shiftType: ShiftType;

  @ApiProperty({ example: 8, description: 'Shift duration in hours' })
  @IsInt()
  @Min(1)
  shiftDuration: number;

  @ApiProperty({
    example: '2025-07-20T09:00:00.000Z',
    description: 'Shift start time (ISO)',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    example: '2025-07-20T17:00:00.000Z',
    description: 'Shift end time (ISO)',
  })
  @IsDateString()
  endTime: string;
}
