import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
