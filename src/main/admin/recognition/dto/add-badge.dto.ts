import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BadgeCategory } from '@prisma/client';


export class AddBadgeDto {
  @ApiProperty({example:'Creative'})
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: BadgeCategory,example:BadgeCategory.MILESTONE })
  @IsEnum(BadgeCategory)
  category: BadgeCategory;
}



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