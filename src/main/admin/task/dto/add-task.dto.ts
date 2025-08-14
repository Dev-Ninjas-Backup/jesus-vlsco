import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Labels, TaskStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class AddTaskDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426655440000' })
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426655440000' })
  @IsUUID()
  @IsNotEmpty()
  assignUserId: string;

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

  @ApiPropertyOptional({
    description: 'Group by field',
    enum: [Labels],
  })
  @IsOptional()
  @IsIn([Labels.HIGH, Labels.LOW, Labels.MEDIUM])
  labels: Labels;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: [TaskStatus],
  })
  @IsOptional()
  @IsIn([TaskStatus.DAFT, TaskStatus.OPEN, TaskStatus.DONE, TaskStatus.OVERDUE])
  status: TaskStatus;
}
