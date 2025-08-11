import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePoolDto {
  @ApiPropertyOptional({ example: 'Q3 Employee Engagement Survey' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'This survey will assess employee engagement.',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Q3 Employee Engagement Survey' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    example: [
      'e432cde3-b4cd-44f7-9bd6-3d287540a839',
      'd132bfc7-1d4e-4472-9d65-72ed7f6bb54c',
    ],
    description: 'Array of employee IDs to assign',
    isArray: true,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  employees?: string[];

  @ApiProperty({ example: true, default: false })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  isForAll?: boolean;

  @ApiPropertyOptional({ example: '2025-08-01T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  publishTime?: string;

  @ApiPropertyOptional({ example: true, default: false })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  showOnFeed?: boolean = false;

  @ApiPropertyOptional({ example: true, default: false })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  shouldNotify?: boolean = false;

  @ApiPropertyOptional({ example: true, default: false })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean = false;

  @ApiPropertyOptional({ example: '2025-08-05T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  reminderTime?: string;

  @ApiProperty({
    example: ['THANKS', 'NOT_THANKS'],
    description: 'Array of option string',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options: string[];
}

export class UpdatePoolDto extends PartialType(CreatePoolDto) {}
