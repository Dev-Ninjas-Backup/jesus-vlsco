import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JopTitle } from '@prisma/client'; // Ensure this enum is exported from Prisma
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
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

  @ApiProperty({ enum: JopTitle })
  @IsEnum(JopTitle)
  jobTitle: JopTitle;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2023-12-31T00:00:00.000Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'Worked on scalable backend services.' })
  @IsString()
  description: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isCurrentlyWorking: boolean;
}

export class ExperienceDto {
  @ApiProperty({ type: [ExperienceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceItemDto)
  experiences: ExperienceItemDto[];
}

export class UpdateExperienceItemDto {
  @ApiPropertyOptional({ example: 'Senior Developer' })
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional({ example: 'Meta' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({ enum: JopTitle })
  @IsOptional()
  @IsEnum(JopTitle)
  jobTitle?: JopTitle;

  @ApiPropertyOptional({ example: '2021-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2022-12-31T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Led product development team.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isCurrentlyWorking?: boolean;
}
