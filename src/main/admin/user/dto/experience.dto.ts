import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JobType } from '@prisma/client'; // Ensure this enum is exported from Prisma
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ExperienceItemDto {
  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  designation: string;

  @ApiProperty({ example: 'Google' })
  @IsString()
  companyName: string;

  @ApiProperty({ enum: JobType })
  @IsEnum(JobType)
  jobType: JobType;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  @IsDate()
  @Type(() => Date)
  startDate: string;

  @ApiPropertyOptional({ example: '2023-12-31T00:00:00.000Z' })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: 'Worked on scalable backend services.' })
  @IsString()
  description: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isCurrentlyWorking: boolean;
}

export class ExperienceDto {
  @ApiProperty({
    type: [ExperienceItemDto],
    description: 'List of experiences',
    example: [
      {
        designation: 'Software Engineer',
        companyName: 'Google',
        jobType: 'FULL_TIME',
        startDate: '2022-01-01T00:00:00.000Z',
        endDate: '2023-12-31T00:00:00.000Z',
        description: 'Worked on scalable backend services.',
        isCurrentlyWorking: false,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ExperienceItemDto)
  experiences: ExperienceItemDto[];
}

export class UpdateExperienceItemDto extends PartialType(ExperienceItemDto) {}
