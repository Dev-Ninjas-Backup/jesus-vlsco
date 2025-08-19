import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
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
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

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
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: Gender })
  @Transform(({ value }) => (value === 'null' ? undefined : value))
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => {
    // * if value is empty, return undefined
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  })
  @IsOptional()
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

export const updateUserSwaggerSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', example: 'user@example.com' },
    phone: { type: 'string', example: '+8801234567890' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    gender: { type: 'string', enum: [Gender.MALE, Gender.FEMALE] },
    address: { type: 'string' },
    state: { type: 'string' },
    dob: { type: 'string', format: 'date-time' },
    country: { type: 'string' },
    nationality: { type: 'string' },
    pinCode: { type: 'integer', example: 1234 },
    profileUrl: { type: 'string', format: 'binary' },
  },
};
