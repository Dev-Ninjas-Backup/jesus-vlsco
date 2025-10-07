import { ApiPropertyOptional } from '@nestjs/swagger';
import { Department, UserEnum } from '@prisma/client';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetUsersDto {
  @ApiPropertyOptional({
    description: 'Search by name, email, phone, or employeeID',
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiPropertyOptional({ enum: UserEnum, description: 'Filter by user role' })
  @IsOptional()
  @IsEnum(UserEnum)
  role?: UserEnum;

  @ApiPropertyOptional({ description: 'Filter by login status' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isLogin?: boolean;

  @ApiPropertyOptional({ description: 'Filter by verification status' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isVerified?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by department(s) in profile',
    isArray: true,
    enum: Department,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Department, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  department?: Department[];

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page for pagination',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

export class GetAssignedUserDto extends PaginationDto {
  @ApiPropertyOptional({
    description:
      'Filter by shift date (ISO 8601). Timezone will affect which day is matched.',
    example: '2025-08-29T02:04:46.000Z',
  })
  @IsOptional()
  @IsISO8601()
  shiftDate?: string;

  @ApiPropertyOptional({
    description:
      'IANA timezone to interpret `shiftDate` in (e.g. "Asia/Dhaka", "America/Los_Angeles"). If omitted, UTC is used.',
    example: 'Asia/Dhaka',
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}
