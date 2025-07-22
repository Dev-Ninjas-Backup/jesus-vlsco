import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum QuestionSourceType {
  SURVEY = 'survey',
  TEMPLATE = 'surveyTemplate',
}

export class GetSurveyQuestionsDto extends PaginationDto {
  @ApiProperty({ enum: QuestionSourceType })
  @IsEnum(QuestionSourceType)
  targetType: QuestionSourceType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  targetId: string; // could be surveyId or templateId depending on type
}

export class CreateQuestionTargetDto {
  @ApiProperty({ enum: QuestionSourceType })
  @IsEnum(QuestionSourceType)
  targetType: QuestionSourceType;
}
