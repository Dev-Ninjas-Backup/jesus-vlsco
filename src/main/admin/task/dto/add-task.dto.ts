import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class AddTaskDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  projectId: string;

  @ApiProperty({ example: 'Design Homepage' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Design the main landing page UI' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2025-08-01T08:00:00Z' })
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({ example: '2025-08-01T17:00:00Z' })
  @Type(() => Date)
  @IsDate()
  endTime: Date;

  @ApiPropertyOptional({ example: 'Dhaka Office' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.DAFT })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ example: ['UI', 'High Priority'] })
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsArray()
  @IsString({ each: true })
  labels: string[];
}
