import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { IsEnum, IsOptional } from 'class-validator';

export enum SurveyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export class GetAllSurveysDto extends PaginationDto {
  @IsOptional()
  @IsEnum(SurveyStatus, {
    message: `status must be one of: ${Object.values(SurveyStatus).join(', ')}`,
  })
  @ApiPropertyOptional({
    enum: SurveyStatus,
    description: 'Filter surveys by status',
    example: SurveyStatus.DRAFT,
  })
  status?: SurveyStatus;

  @IsOptional()
  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'asc' })
  @IsEnum(['asc', 'desc'])
  orderBy: 'desc' | 'asc';
}
