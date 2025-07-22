import { ApiPropertyOptional } from '@nestjs/swagger';
import { SurveyStatus, SurveyType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSurveyFromTemplateDto {
  @ApiPropertyOptional({ enum: SurveyType })
  @IsOptional()
  @IsEnum(SurveyType)
  surveyType?: SurveyType;

  @ApiPropertyOptional({ enum: SurveyStatus, default: SurveyStatus.DRAFT })
  @IsOptional()
  @IsEnum(SurveyStatus)
  status?: SurveyStatus;

  @ApiPropertyOptional({ example: 'Q3 Employee Engagement Survey' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'This survey will assess employee engagement.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2025-08-01T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  publishTime?: string;

  @ApiPropertyOptional({ example: '2025-08-05T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  reminderTime?: string;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  showOnFeed?: boolean;
}
