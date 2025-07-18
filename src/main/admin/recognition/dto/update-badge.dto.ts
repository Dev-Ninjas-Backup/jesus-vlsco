import { IsEnum,  IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BadgeCategory } from '@prisma/client';

export class UpdateBadgeDto {
  @ApiPropertyOptional({ example: 'Creative' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ enum: BadgeCategory, example: BadgeCategory.MILESTONE })
  @IsEnum(BadgeCategory)
  @IsOptional()
  category?: BadgeCategory;
}