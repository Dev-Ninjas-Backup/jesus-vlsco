import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BreakTimePerDay, Department, Gender, JopTitle, PayRateType, Weekdays } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { EducationItemDto } from './education.dto';
import { ExperienceItemDto } from './experience.dto';

/**
 * Transforms empty string values into `undefined` so `@IsOptional()` will skip validation.
 */
function EmptyToUndefined() {
  return Transform(({ value }) => (value === '' ? undefined : value));
}

export class UpdateSingleExperienceDto extends PartialType(ExperienceItemDto) {
  @ApiPropertyOptional({
    example: 'experience_abc123',
    description: 'ID of the existing Experience to update',
  })
  @IsString()
  @IsOptional()
  id?: string;
}

export class UpdateSingleEducationDto extends PartialType(EducationItemDto) {
  @ApiPropertyOptional({
    example: 'education_abc123',
    description: 'ID of the existing Education to update',
  })
  @IsString()
  @IsOptional()
  id?: string;
}

export class UpdateProfileDto {
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
  @Type(() => Date)
  @IsDate()
  @Transform(({ value }) => {
    // * if value is empty, return undefined
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  })
  dob: Date;

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

export class UpdatePayrollDto {
  @ApiPropertyOptional({ example: 100, description: 'Regular pay rate amount' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  regularPayRate?: number;

  @ApiPropertyOptional({
    enum: PayRateType,
    example: PayRateType.HOUR,
    description: 'Unit for regular pay rate',
  })
  @IsOptional()
  @IsEnum(PayRateType)
  regularPayRateType?: PayRateType;

  @ApiPropertyOptional({ example: 150, description: 'Overtime pay rate amount' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  overTimePayRate?: number;

  @ApiPropertyOptional({
    enum: PayRateType,
    example: PayRateType.HOUR,
    description: 'Unit for overtime pay rate',
  })
  @IsOptional()
  @IsEnum(PayRateType)
  overTimePayRateType?: PayRateType;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of casual leave days per year',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  casualLeave?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Number of sick leave days per year',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  sickLeave?: number;

  @ApiPropertyOptional({ example: 2, description: 'Number of off days per week' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  numberOffDay?: number;

  @ApiPropertyOptional({
    isArray: true,
    enum: Weekdays,
    example: [Weekdays.SATURDAY, Weekdays.SUNDAY],
    description: 'Selected off days',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Weekdays, { each: true })
  offDay?: Weekdays[];

  @ApiPropertyOptional({
    enum: BreakTimePerDay,
    example: BreakTimePerDay.ONE_HOUR,
    description: 'Break time per day',
  })
  @IsOptional()
  @IsEnum(BreakTimePerDay)
  breakTimePerDay?: BreakTimePerDay;
}

export class UpdateFullUserDto {
  // * Manage Profile
  @ApiProperty({
    type: UpdateProfileDto,
    required: false,
    description: 'Profile to update (only changed ones)',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProfileDto)
  profile?: UpdateProfileDto;

  // * manage experience
  @ApiProperty({
    type: [UpdateSingleExperienceDto],
    required: false,
    description: 'List of Experiences to update (only changed ones)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSingleExperienceDto)
  experiences?: UpdateSingleExperienceDto[];

  // * Manage Educations
  @ApiProperty({
    type: [UpdateSingleEducationDto],
    required: false,
    description: 'List of Educations to update (only changed ones)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSingleEducationDto)
  educations?: UpdateSingleExperienceDto[];

  // * Manage Payroll
  @ApiProperty({
    type: UpdatePayrollDto,
    required: false,
    description: 'Payroll to update (only changed ones)',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePayrollDto)
  payroll?: UpdatePayrollDto;
}
