import {
  IsUUID,
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SelectedOptionDto {
  @IsUUID()
  optionId: string;
}

export class SubmitQuestionAnswerDto {
  @IsUUID()
  surveyId: string;

  @IsUUID()
  questionId: string;

  @IsOptional()
  @IsString()
  answerText?: string;

  @IsOptional()
  @IsInt()
  rate?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedOptionDto)
  selectedOptions?: SelectedOptionDto[];
}
