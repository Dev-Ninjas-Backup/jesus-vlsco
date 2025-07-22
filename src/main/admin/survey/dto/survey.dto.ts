import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SurveyStatus, SurveyType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { QuestionDto } from './question.dto';

export class CreateSurveyDto {
  @ApiProperty({ example: 'Q3 Employee Engagement Survey' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'This survey will assess employee engagement.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: SurveyType })
  @IsEnum(SurveyType)
  surveyType: SurveyType;

  @ApiPropertyOptional({ enum: SurveyStatus, default: SurveyStatus.DRAFT })
  @IsOptional()
  @IsEnum(SurveyStatus)
  status?: SurveyStatus = SurveyStatus.DRAFT;

  @ApiPropertyOptional({ example: '2025-08-01T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  publishTime?: string;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  showOnFeed?: boolean = false;

  @ApiPropertyOptional({ example: '2025-08-05T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  reminderTime?: string;

  @ApiProperty({ type: [QuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class UpdateSurveyDto extends PartialType(CreateSurveyDto) {}
