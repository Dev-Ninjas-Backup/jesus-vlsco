import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: '8801234567890' })
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'strongpassword123' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ example: 1234 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pinCode?: number;

  // Profile fields
  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @Type(() => Date)
  @IsDate()
  dob?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nationality?: string;
}
