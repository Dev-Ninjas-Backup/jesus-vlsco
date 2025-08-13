import { ApiPropertyOptional } from '@nestjs/swagger';
import { Department, Gender, JopTitle, UserEnum } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

/**
 * Transforms empty string values into `undefined` so `@IsOptional()` will skip validation.
 */
function EmptyToUndefined() {
  return Transform(({ value }) => (value === '' ? undefined : value));
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: '8801234567890' })
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  phone?: string;

  @ApiPropertyOptional({ example: 1001 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @EmptyToUndefined()
  employeeID?: number;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  @EmptyToUndefined()
  email?: string;

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

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  firstName?: string;

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
