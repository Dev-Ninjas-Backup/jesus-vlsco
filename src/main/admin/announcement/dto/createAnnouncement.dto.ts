import {
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class AttachmentInput {
  @ApiProperty({
    example: 'https://example.com/uploads/file.pdf',
    description: 'Publicly accessible URL of the attachment',
  })
  @IsString()
  url: string;
}

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'System Maintenance Notice' })
  @IsString()
  title: string;

  @ApiProperty({
    example: { content: '<p>We’ll be performing maintenance...</p>' },
    description: 'Rich text description stored as JSON',
  })
  description: any; // stored as JSON

  @ApiProperty({ example: 'ALL_EMPLOYEES' })
  @IsString()
  audience: string;

  @ApiProperty({ example: 'cat_abc123', description: 'ID of the selected category' })
  @IsString()
  categoryId: string;

  @ApiProperty({
    example: true,
    description: 'Whether to publish immediately or schedule it',
  })
  @IsBoolean()
  publishedNow: boolean;

  @ApiProperty({
    example: '2025-07-21T10:00:00.000Z',
    description: 'Optional future publish time if not publishing now',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: Date;

  @ApiProperty({
    example: true,
    description: 'Should recipients get an email',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  sendEmailNotification?: boolean;

  @ApiProperty({
    example: false,
    description: 'Should read receipt tracking be enabled',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enabledReadReceipt?: boolean;

  @ApiProperty({
    type: [AttachmentInput],
    description: 'Optional list of attachments with public URLs',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentInput)
  attachments?: AttachmentInput[];
}
