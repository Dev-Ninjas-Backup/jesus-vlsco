import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class GetRecognitionDto {
  @ApiPropertyOptional({ description: 'Search by message or badge title' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Start Date', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End Date', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 10;
}
