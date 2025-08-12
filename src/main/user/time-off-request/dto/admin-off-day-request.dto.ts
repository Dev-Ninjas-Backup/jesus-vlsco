import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TimeOffRequestStatus } from '@prisma/client';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AdminRequestOffDayStatusDto {
  @ApiProperty({
    description: 'Status of the request',
    enum: TimeOffRequestStatus,
    example: TimeOffRequestStatus.PENDING,
  })
  @IsEnum([
    TimeOffRequestStatus.PENDING,
    TimeOffRequestStatus.APPROVED,
    TimeOffRequestStatus.REJECTED,
  ])
  status: TimeOffRequestStatus;

  @ApiPropertyOptional({ description: 'Admin note' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  adminNote?: string;
}

export class GetTimeOffRequestDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'User ID to filter by',
    example: 'user_abc123',
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter requests starting from this date (ISO string)',
    example: '2023-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Filter requests up to this date (ISO string)',
    example: '2023-01-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
