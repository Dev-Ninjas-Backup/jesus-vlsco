import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsString,
  MaxLength,
  Min
} from 'class-validator';

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
) { }
