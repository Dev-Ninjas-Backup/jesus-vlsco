import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class ShiftTemplateDto {
  @ApiProperty({
    description: 'Unique identifier of the shift template',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  id: string;

  @ApiProperty({
    description: 'Start time of the shift',
    example: '2025-09-18T09:00:00Z',
  })
  @IsDate()
  startTime: Date;

  @ApiProperty({
    description: 'End time of the shift',
    example: '2025-09-18T17:00:00Z',
  })
  @IsDate()
  endTime: Date;

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
  @IsNumber()
  locationLat: number;

  @ApiProperty({
    description: 'Longitude coordinate of the location',
    example: 90.4125,
    default: 0.0,
  })
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

  @ApiProperty({
    description: 'Timestamp when the shift template was created',
    example: '2025-09-18T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the shift template was last updated',
    example: '2025-09-18T12:00:00Z',
  })
  updatedAt: Date;
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
