import { ApiPropertyOptional } from '@nestjs/swagger';
import { Department, UserEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
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

  @ApiPropertyOptional({
    description:'Filter by employee Assigned to',   
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  assigned?: boolean;

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

  @ApiPropertyOptional({ description: 'Sort by field (e.g. createdAt, email)' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order: ASC or DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

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
