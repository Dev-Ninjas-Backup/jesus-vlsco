import { BadgeCategory } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetBadgeDto {
  @ApiPropertyOptional({
    enum: BadgeCategory,
    description: 'Category of the badge',
    example: BadgeCategory.GOOD_JOB,
  })
  @IsOptional()
  @IsEnum(BadgeCategory)
  badgeCategory?: BadgeCategory;
}
