import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetAssignedSurveyDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'My free-text answer',
    description: 'Search by survey title',
  })
  @IsString()
  @IsOptional()
  searchTerm?: string;
}
