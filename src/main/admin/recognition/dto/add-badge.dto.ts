import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BadgeCategory } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddBadgeDto {
  @ApiProperty({ example: 'Creative' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: BadgeCategory, example: BadgeCategory.MILESTONE })
  @IsEnum(BadgeCategory)
  category: BadgeCategory;
}

function EmptyToUndefined() {
  return Transform(({ value }) => (value === '' ? undefined : value));
}

export class UpdateBadgeDto {
  @ApiPropertyOptional({ example: 'Creative' })
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  title?: string;

  @ApiPropertyOptional({
    enum: BadgeCategory,
    example: BadgeCategory.MILESTONE,
  })
  @IsOptional()
  @IsEnum(BadgeCategory)
  @EmptyToUndefined()
  category?: BadgeCategory;
}
