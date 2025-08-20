import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

enum AnnouncementSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  PUBLISHED_AT = 'publishedAt',
  VIEW_COUNT = 'viewCount',
  LIKE_COUNT = 'likeCount',
}

enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetAnnouncementDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'e432cde3-b4cd-44f7-9bd6-3d287540a839',
    description: 'Filter by team',
  })
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @ApiPropertyOptional({
    example: 'b412da5c-dc0d-4c76-92d6-c0b9087a4449',
    description: 'Filter by category',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    example: 'Quarterly Update',
    description: 'Filter by title keyword (partial match)',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Only published announcements',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  publishedNow?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Filter by whether email notification is enabled',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  sendEmailNotification?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by read receipt toggle',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  enabledReadReceipt?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter announcements for all users',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isForAllUsers?: boolean;

  @ApiPropertyOptional({
    example: '2025-07-01T00:00:00.000Z',
    description: 'Published after this date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedFrom?: Date;

  @ApiPropertyOptional({
    example: '2025-07-31T23:59:59.999Z',
    description: 'Published before this date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedTo?: Date;

  @ApiPropertyOptional({
    enum: AnnouncementSortBy,
    example: AnnouncementSortBy.CREATED_AT,
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsEnum(AnnouncementSortBy)
  sortBy?: AnnouncementSortBy = AnnouncementSortBy.CREATED_AT;

  @ApiPropertyOptional({
    enum: SortOrder,
    example: SortOrder.DESC,
    description: 'Sort order',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  orderBy?: SortOrder = SortOrder.DESC;
}
