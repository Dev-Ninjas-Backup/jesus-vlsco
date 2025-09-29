import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';

export class UpdateTimeClockDto {
  @ApiPropertyOptional({
    description: 'Clock in time (ISO 8601 format)',
    type: String,
    example: '2025-09-30T08:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  clockInAt?: string;

  @ApiPropertyOptional({
    description:
      'Clock out time (ISO 8601 format). If provided, must not be empty.',
    type: String,
    example: '2025-09-30T17:00:00Z',
  })
  @IsOptional()
  @IsISO8601()
  clockOutAt?: string;
}
