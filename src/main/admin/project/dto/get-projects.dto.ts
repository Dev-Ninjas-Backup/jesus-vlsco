import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class GetProjectsDto {
  @ApiPropertyOptional({ description: 'Filter by exact manager ID' })
  @IsOptional()
  @IsUUID()
  managerId?: string;

  @ApiPropertyOptional({ description: 'Filter by exact team ID' })
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @ApiPropertyOptional({
    description: 'Filter by a user assigned to the project',
  })
  @IsOptional()
  @IsUUID()
  assignedUserId?: string;

  @ApiPropertyOptional({ description: 'Filter by projectLocation substring' })
  @IsOptional()
  @IsString()
  projectLocation?: string;

  @ApiPropertyOptional({ description: 'Search keyword (title OR location)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter tasks by status' })
  @IsOptional()
  @IsIn(['DAFT', 'OPEN', 'DONE'])
  status?: 'DAFT' | 'OPEN' | 'DONE';

  @ApiPropertyOptional({
    description: 'Only include projects created after this date',
  })
  @IsOptional()
  @IsDateString()
  createdAfter?: string;

  @ApiPropertyOptional({
    description: 'Only include projects created before this date',
  })
  @IsOptional()
  @IsDateString()
  createdBefore?: string;

  @ApiPropertyOptional({ description: 'Page number (1‑indexed)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: ['title', 'projectLocation', 'createdAt'],
  })
  @IsOptional()
  @IsIn(['title', 'projectLocation', 'createdAt'])
  sortBy?: 'title' | 'projectLocation' | 'createdAt' = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
