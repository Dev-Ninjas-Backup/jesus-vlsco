import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ClientDateDto } from '@project/common/dto/client-date.dto';
import { Type } from 'class-transformer';
import { IsDate, IsISO8601, IsOptional } from 'class-validator';

export class GetAssignedShiftsDto extends PartialType(ClientDateDto) {
  @ApiPropertyOptional({
    description:
      'Date in ISO 8601 format (UTC). Example: 2025-08-29T02:04:46.000Z',
    type: String,
    format: 'date-time',
    example: '2025-08-29T02:04:46.000Z',
  })
  @IsOptional()
  @IsISO8601()
  date?: string;

  @ApiPropertyOptional({
    description: 'Start time of the shift (ISO format)',
    example: '2025-08-07T08:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End time of the shift (ISO format)',
    example: '2025-08-07T16:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: string;
}
