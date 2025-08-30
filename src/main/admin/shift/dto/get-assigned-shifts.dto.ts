import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ClientDateDto } from '@project/common/dto/client-date.dto';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class GetAssignedShiftsDto extends PartialType(ClientDateDto) {
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
