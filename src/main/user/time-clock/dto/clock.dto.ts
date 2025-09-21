import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientDateDto } from '@project/common/dto/client-date.dto';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ClockAction {
  CLOCK_IN = 'CLOCK_IN',
  CLOCK_OUT = 'CLOCK_OUT',
}

export class ClockDto extends ClientDateDto {
  @ApiProperty({
    description: 'Latitude of the user location',
    example: 23.8103,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Latitude must be a number' })
  lat: number;

  @ApiProperty({
    description: 'Longitude of the user location',
    example: 90.4125,
  })
  @Type(() => Number)
  @IsNumber({}, { message: 'Longitude must be a number' })
  lng: number;

  @ApiProperty({
    description: 'Action to perform (CLOCK_IN or CLOCK_OUT)',
    example: ClockAction.CLOCK_IN,
    enum: ClockAction,
  })
  @IsEnum(ClockAction)
  action: ClockAction;
}

export class GetClockSheet {
  @ApiPropertyOptional({
    description: 'Start time of the shift (ISO format)',
    example: '2025-08-07T08:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({
    description: 'End time of the shift (ISO format)',
    example: '2025-08-07T16:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiPropertyOptional({
    description: 'Filter by timezone',
    example: 'America/Los_Angeles',
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}

export class SubmitTimeSheet {
  @ApiProperty({
    description: 'Start time of the shift (ISO format)',
    example: '2025-08-07T08:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  from: Date;

  @ApiProperty({
    description: 'End time of the shift (ISO format)',
    example: '2025-08-07T16:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  to: Date;
}
