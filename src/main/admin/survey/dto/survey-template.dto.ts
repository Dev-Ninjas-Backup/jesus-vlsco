import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { QuestionDto } from './question.dto';

export class CreateSurveyTemplateDto {
  @ApiProperty({ example: 'New Survey Template' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This is a new survey template' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [QuestionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class UpdateSurveyTemplateDto extends PartialType(
  CreateSurveyTemplateDto,
) {}

export class GetAllSurveyTemplateDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiProperty({ enum: ['asc', 'desc'], default: 'asc', required: false })
  @IsOptional()
  @IsString()
  orderBy: 'asc' | 'desc';
}
