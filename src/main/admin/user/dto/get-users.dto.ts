import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';


export class GetUsersDto {
  @ApiPropertyOptional({ description: 'Search by name, email, phone, or employeeID' })
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


  @ApiPropertyOptional({ description: 'Filter by date user was created after this date', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  createdAfter?: Date;

  @ApiPropertyOptional({ description: 'Filter by date user was created before this date', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  createdBefore?: Date;

  @ApiPropertyOptional({ description: 'Sort by field (e.g. createdAt, email)' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order: ASC or DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Page number for pagination', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page for pagination', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
