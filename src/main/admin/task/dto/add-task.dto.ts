import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class AddTaskDto {
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

  @ApiPropertyOptional({ example: ['UI', 'High Priority'] })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (err) {
        console.info(err);
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  labels: any;
}
