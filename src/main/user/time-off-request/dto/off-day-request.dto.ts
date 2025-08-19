import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { TimeOffRequestType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

const typeMap: Record<string, TimeOffRequestType> = {
  'sick-leave': TimeOffRequestType.SICK_LEAVE,
  'time-off': TimeOffRequestType.TIME_OFF,
  'casual-leave': TimeOffRequestType.CASUAL_LEAVE,
  'unpaid-leave': TimeOffRequestType.UNPAID,
};

export class CreateTimeOffRequestDto {
  @ApiProperty({ description: 'Off Day Start', example: '2023-10-10' })
  @IsDate()
  @Type(() => Date)
  startDate: string;

  @ApiProperty({ description: 'Off Day End', example: '2023-10-15' })
  @IsDate()
  @Type(() => Date)
  endDate: string;

  @ApiProperty({ description: 'Write your reason', example: 'Sick leave' })
  @IsString()
  @MaxLength(200)
  reason: string;

  @ApiProperty({
    description: 'Type of leave',
    enum: Object.keys(typeMap),
    example: 'sick-leave',
  })
  @Transform(({ value }) => typeMap[value] ?? TimeOffRequestType.TIME_OFF)
  @IsEnum(TimeOffRequestType)
  type: TimeOffRequestType;

  @ApiProperty({ description: 'You want to take full day off' })
  @IsBoolean()
  isFullDayOff: boolean;

  @ApiProperty({ description: 'Total Off day', example: 2 })
  @IsInt()
  @Min(1)
  totalDaysOff: number;
}

export class UpdateTimeOffRequestDto extends PartialType(
  CreateTimeOffRequestDto,
) {}
