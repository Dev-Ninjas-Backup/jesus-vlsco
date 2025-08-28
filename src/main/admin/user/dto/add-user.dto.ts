import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Department, Gender, JopTitle, UserEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';

function EmptyToUndefined() {
  return Transform(({ value }) => (value === '' ? undefined : value));
}

export class AddUserDto {
  @ApiProperty({ example: '8801234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 1001 })
  @Type(() => Number)
  @IsInt()
  employeeID: number;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  // Optional fields
  @ApiPropertyOptional({ enum: UserEnum, example: UserEnum.EMPLOYEE })
  @IsOptional()
  @IsEnum(UserEnum)
  @EmptyToUndefined()
  role?: UserEnum;

  @ApiPropertyOptional({ example: 'strongpassword123' })
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  password?: string;

  @ApiPropertyOptional({ example: 1234 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @EmptyToUndefined()
  pinCode?: number;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  lastName?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  @EmptyToUndefined()
  gender?: Gender;

  @ApiPropertyOptional({ enum: JopTitle })
  @IsOptional()
  @IsEnum(JopTitle)
  @EmptyToUndefined()
  jobTitle?: JopTitle;

  @ApiPropertyOptional({ enum: Department })
  @IsOptional()
  @IsEnum(Department)
  @EmptyToUndefined()
  department?: Department;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  state?: string;

  @ApiPropertyOptional({
    description: 'date in iso format',
    example: '2000-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsISO8601()
  dob?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  nationality?: string;
}
