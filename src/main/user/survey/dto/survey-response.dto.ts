import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { SubmitQuestionAnswerDto } from './survey-answer.dto';

export class SubmitSurveyResponseDto {
  @ApiProperty({ type: [SubmitQuestionAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitQuestionAnswerDto)
  answers: SubmitQuestionAnswerDto[];
}
