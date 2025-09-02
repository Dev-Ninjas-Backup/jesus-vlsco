import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class GetUserShiftsDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'Test Shift',
    description: 'Search by shift title or location',
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;
}
