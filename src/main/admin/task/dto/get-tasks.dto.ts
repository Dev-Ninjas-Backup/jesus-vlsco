import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class GetTasksDto {
  @ApiPropertyOptional({ description: 'Filter by exact project ID' })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Filter by assigned user ID' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by task status',
    example: TaskStatus.DONE,
    enum: TaskStatus,
  })
  @Transform(({ value }) => {
    // * if value is empty, return undefined
    if (!value || value === '' || value.trim() === '') return undefined;
    return value.toUpperCase();
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Search keyword in title or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter tasks starting after this date/time',
    example: '2023-01-01T00:00:00Z',
  })
  // @Transform(({ value }) => {
  //   // * if value is empty, return undefined
  //   if (!value) return undefined;
  //   const date = new Date(value);
  //   return isNaN(date.getTime()) ? undefined : date.toISOString();
  // })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startAfter?: Date;

  @ApiPropertyOptional({
    description: 'Filter tasks ending before this date/time',
    example: '2023-01-01T00:00:00Z',
  })
  // @Transform(({ value }) => {
  //   // * if value is empty, return undefined
  //   if (!value) return undefined;
  //   const date = new Date(value);
  //   return isNaN(date.getTime()) ? undefined : date.toISOString();
  // })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endBefore?: Date;

  @ApiPropertyOptional({
    description: 'Filter by labels (tasks containing all these labels)',
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  labels?: string[];

  @ApiPropertyOptional({ description: 'Page number (1-indexed)', default: 1 })
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
    enum: ['startTime', 'endTime', 'createdAt'],
  })
  @IsOptional()
  @IsIn(['startTime', 'endTime', 'createdAt'])
  sortBy?: 'startTime' | 'endTime' | 'createdAt' = 'createdAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({
    description: 'Group by field',
    enum: ['label', 'title', 'assignedTo'],
  })
  @IsOptional()
  @IsIn(['label', 'title', 'assignedTo'])
  groupBy: 'label' | 'title' | 'assignedTo' = 'label';
}
