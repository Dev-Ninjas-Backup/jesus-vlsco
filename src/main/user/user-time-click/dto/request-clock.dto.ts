import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMissedClockRequestDto {
  @ApiPropertyOptional({
    description: 'Shift ID (nullable if not tied to a shift)',
    example: '4a8d8c19-55f0-42c1-9116-18c067e541e7',
  })
  @IsOptional()
  @IsUUID()
  shiftId?: string;

  @ApiProperty({
    description: 'Requested clock-in time in ISO format',
    example: '2025-08-31T08:00:00.000Z',
  })
  @IsISO8601()
  requestedClockInAt: string;

  @ApiProperty({
    description: 'Requested clock-out time in ISO format',
    example: '2025-08-31T17:00:00.000Z',
  })
  @IsISO8601()
  requestedClockOutAt: string;

  @ApiProperty({
    description: 'Location name or address',
    example: 'Head Office - Dhaka',
  })
  @IsString()
  location: string;

  @ApiPropertyOptional({
    description: 'Latitude of the location',
    example: 23.8103,
  })
  @Type(() => Number)
  @IsNumber()
  locationLat: number;

  @ApiPropertyOptional({
    description: 'Longitude of the location',
    example: 90.4125,
  })
  @Type(() => Number)
  @IsNumber()
  locationLng: number;

  @ApiProperty({
    description: 'Reason for missing the clock in/out',
    example: 'Forgot to clock in due to meeting',
  })
  @IsString()
  reason: string;
}

export class UpdateClockRequestDto extends PartialType(
  CreateMissedClockRequestDto,
) {}
