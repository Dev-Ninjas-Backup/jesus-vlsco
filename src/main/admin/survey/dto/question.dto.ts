import { ApiProperty } from "@nestjs/swagger";
import { SurveyQuestionType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class QuestionOptionDto {
  @ApiProperty({ example: 'Very Satisfied' })
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class QuestionDto {
  @ApiProperty({ example: 'How satisfied are you with your job?' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ example: 'Rate your satisfaction on a scale of 1–5', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: SurveyQuestionType, example: SurveyQuestionType.SELECT })
  @IsNotEmpty()
  type: SurveyQuestionType;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  order: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Type(() => Boolean)
  @IsNotEmpty()
  isRequired: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  captureLocation: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  multiSelect?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  rangeStart?: number;

  @ApiProperty({ example: 5, required: false })
  @IsInt()
  @IsOptional()
  rangeEnd?: number;

  @ApiProperty({ type: String, required: false, example: ['1', '2', '3'] })
  @IsArray()
  @IsOptional()
  options?: string[];
}
