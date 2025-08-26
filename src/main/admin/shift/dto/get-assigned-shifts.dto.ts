import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class GetAssignedShiftsDto {
  @ApiPropertyOptional({
    description: 'Start time of the shift (ISO format)',
    example: '2025-08-07T08:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End time of the shift (ISO format)',
    example: '2025-08-07T16:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
