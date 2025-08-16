import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Reaction } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class GetRecognitionDto {
  @ApiPropertyOptional({ description: 'Search by message or badge title' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Start Date', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End Date', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 10;
}

export class CreateRecognitionLikeDto {
  @ApiPropertyOptional({ description: 'Optional comment text' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ description: 'Reaction type', enum: Reaction })
  @IsOptional()
  @IsEnum(Reaction)
  reaction?: Reaction;

  @ApiPropertyOptional({
    description:
      'ID of the comment (if this is a update to an existing comment)',
  })
  @IsOptional()
  @IsUUID()
  commentId?: string;

  @ApiPropertyOptional({
    description: 'ID of the parent comment (if this is a reply)',
  })
  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}

export class UpdateRecognitionLikeDto {
  @ApiPropertyOptional({ description: 'Optional comment text' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ description: 'Reaction type', enum: Reaction })
  @IsOptional()
  @IsEnum(Reaction)
  reaction?: Reaction;
}

export class LikeUnlikeRecognitionDto {
  @ApiProperty({ description: 'isLike' })
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @Type(() => Boolean)
  @IsBoolean()
  isLike: boolean;
}
