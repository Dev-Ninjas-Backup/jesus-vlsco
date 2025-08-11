import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SurveyQuestionType, SurveyStatus, SurveyType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
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

  @ApiProperty({
    example: [
      'e432cde3-b4cd-44f7-9bd6-3d287540a839',
      'd132bfc7-1d4e-4472-9d65-72ed7f6bb54c',
    ],
    description: 'Array of employee IDs to assign',
    isArray: true,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  employees?: string[];

  @ApiProperty({ example: true, default: false })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  isForAll?: boolean;

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

  @ApiProperty({
    example: [
      {
        question: 'How satisfied are you with your job?',
        description: 'Rate your satisfaction on a scale of 1–5',
        type: 'SELECT',
        order: 1,
        isRequired: true,
        captureLocation: false,
        multiSelect: false,
        options: ['1', '2', '3'],
      },
      {
        question: 'How satisfied are you with your job?',
        description: 'Rate your satisfaction on a scale of 1–5',
        type: SurveyQuestionType.OPEN_ENDED,
        order: 2,
        isRequired: true,
        captureLocation: false,
      },
      {
        question: 'How satisfied are you with your job?',
        description: 'Rate your satisfaction on a scale of 1–5',
        type: SurveyQuestionType.RANGE,
        order: 3,
        isRequired: true,
        captureLocation: false,
        rangeStart: 1,
        rangeEnd: 5,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class UpdateSurveyDto extends PartialType(CreateSurveyDto) {
  @ApiProperty({ enum: SurveyType })
  @IsEnum(SurveyType)
  surveyType: SurveyType;

  @ApiPropertyOptional({ enum: SurveyStatus, default: SurveyStatus.DRAFT })
  @IsOptional()
  @IsEnum(SurveyStatus)
  status?: SurveyStatus = SurveyStatus.DRAFT;
}
