import { ApiPropertyOptional } from '@nestjs/swagger';
import { Labels, TaskStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

function EmptyToUndefined() {
  return Transform(({ value }) => (value === '' ? undefined : value));
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426655440000' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426655440000' })
  @IsOptional()
  @IsString()
  assignUserId?: string;

  @ApiPropertyOptional({ example: 'Design Homepage' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Design the main landing page UI' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2025-08-01T08:00:00Z' })
  @Transform(({ value }) => {
    // * if value is empty, return undefined
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @EmptyToUndefined()
  startTime?: Date;

  @ApiPropertyOptional({ example: '2025-08-01T17:00:00Z' })
  @Transform(({ value }) => {
    // * if value is empty, return undefined
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @EmptyToUndefined()
  endTime?: Date;

  @ApiPropertyOptional({ example: 'Dhaka Office' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Group by field',
    enum: Labels,
  })
  @IsOptional()
  @IsEnum(Labels)
  @EmptyToUndefined()
  labels?: Labels;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatus,
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  @EmptyToUndefined()
  status?: TaskStatus;
}
