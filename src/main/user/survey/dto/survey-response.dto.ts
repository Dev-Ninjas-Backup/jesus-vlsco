import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class AnswerOptionDto {
  @ApiProperty({ example: 'option‑uuid‑here' })
  @IsUUID()
  optionId: string;
}

export class SubmitAnswerDto {
  @ApiProperty({ example: 'question‑uuid‑here' })
  @IsUUID()
  questionId: string;

  @ApiPropertyOptional({ example: 'My free‑text answer' })
  @IsOptional()
  @IsString()
  answerText?: string;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  rate?: number;

  @ApiPropertyOptional({ type: [AnswerOptionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerOptionDto)
  @IsOptional()
  options?: AnswerOptionDto[];
}

export class SubmitSurveyResponseDto {
  @ApiProperty({ type: [SubmitAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDto)
  answers: SubmitAnswerDto[];
}
