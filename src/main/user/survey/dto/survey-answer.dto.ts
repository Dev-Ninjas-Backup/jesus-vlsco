import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class SelectedOptionDto {
  @ApiProperty({
    type: String,
    example: '6f2f2f2f-2f2f-2f2f-2f2f-2f2f2f2f2f2f',
  })
  @IsUUID()
  optionId: string;
}

export class SubmitQuestionAnswerDto {
  @ApiProperty({
    type: String,
    example: '6f2f2f2f-2f2f-2f2f-2f2f-2f2f2f2f2f2f',
  })
  @IsUUID()
  surveyId: string;

  @ApiProperty({
    type: String,
    example: '6f2f2f2f-2f2f-2f2f-2f2f-2f2f2f2f2f2f',
  })
  @IsUUID()
  questionId: string;

  @ApiProperty({ type: String, example: 'Answer text' })
  @IsOptional()
  @IsString()
  answerText?: string;

  @ApiProperty({ type: Number, example: 5 })
  @IsOptional()
  @IsInt()
  rate?: number;

  @ApiProperty({
    type: [SelectedOptionDto],
    example: [{ optionId: '6f2f2f2f-2f2f-2f2f-2f2f-2f2f2f2f2f2f' }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedOptionDto)
  selectedOptions?: SelectedOptionDto[];
}
