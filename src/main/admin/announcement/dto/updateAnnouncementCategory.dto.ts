import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAnnouncementCategoryDto {
  @ApiProperty({
    example: 'Company Updates',
    description: 'Name of the announcement category',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'Updates related to company policies and announcements',
    description: 'Description of the announcement category',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
