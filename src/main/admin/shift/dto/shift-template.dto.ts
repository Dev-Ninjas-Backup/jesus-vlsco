import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { Type } from 'class-transformer';
import { IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';

export class ShiftTemplateDto {
  @ApiProperty({
    description: 'Start time of the shift in ISO 8601 format',
    example: '2025-09-18T08:00:00Z',
  })
  @IsISO8601()
  startTime: string;

  @ApiProperty({
    description: 'End time of the shift in ISO 8601 format',
    example: '2025-09-18T17:00:00Z',
  })
  @IsISO8601()
  endTime: string;

  @ApiProperty({
    description: 'Location name of the shift',
    example: 'Head Office, Dhaka',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Latitude coordinate of the location',
    example: 23.8103,
    default: 0.0,
  })
  @Type(() => Number)
  @IsNumber()
  locationLat: number;

  @ApiProperty({
    description: 'Longitude coordinate of the location',
    example: 90.4125,
    default: 0.0,
  })
  @Type(() => Number)
  @IsNumber()
  locationLng: number;

  @ApiProperty({
    description: 'Title of the shift template',
    example: 'Morning Shift',
  })
  @IsString()
  templateTitle: string;

  @ApiPropertyOptional({
    description: 'Optional job associated with this shift',
    example: 'Cashier',
    required: false,
  })
  @IsOptional()
  @IsString()
  job?: string;

  @ApiPropertyOptional({
    description: 'Optional notes for the shift',
    example: 'Bring your ID card',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateShiftTemplateDto extends PartialType(ShiftTemplateDto) {}

export class GetAllShiftTemplateDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search keyword for template title',
    example: 'Morning Shift',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by location name',
    example: 'Head Office, Dhaka',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Filter by job title',
    example: 'Cashier',
  })
  @IsOptional()
  @IsString()
  job?: string;
}
