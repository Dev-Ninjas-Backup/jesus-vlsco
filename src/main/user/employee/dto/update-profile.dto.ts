import { ApiPropertyOptional } from '@nestjs/swagger';
import { Department, Gender } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsISO8601,
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
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 1234 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pinCode?: number;

  // Profile fields
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
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
  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  dob?: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({ enum: Department })
  @IsOptional()
  @IsEnum(Department)
  department?: Department;

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
    gender: {
      type: 'string',
      enum: [
        Gender.MALE,
        Gender.FEMALE,
        Gender.OTHER,
        Gender.PREFER_NOT_TO_SAY,
      ],
    },
    address: { type: 'string' },
    state: { type: 'string' },
    jobTitle: { type: 'string' },
    department: {
      type: 'string',
      enum: [
        Department.CARPENTER,
        Department.ELECTRICIAN,
        Department.DEVELOPMENT,
        Department.HR,
        Department.FINANCE,
        Department.MARKETING,
        Department.LABOURER,
        Department.IT,
        Department.SEALS,
        Department.DRIVER,
      ],
    },
    dob: { type: 'string', format: 'date-time' },
    country: { type: 'string' },
    nationality: { type: 'string' },
    pinCode: { type: 'integer', example: 1234 },
    profileUrl: { type: 'string', format: 'binary' },
  },
};
