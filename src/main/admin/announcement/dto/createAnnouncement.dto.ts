import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class AttachmentInput {
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
    example: '<p>We’ll be performing maintenance...</p>',
    description: 'Rich text description stored as JSON',
  })
  @IsString()
  description: any; // stored as JSON

  @ApiProperty({
    example: 'cat_abc123',
    description: 'ID of the selected category',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: true,
    description: 'Whether to publish immediately or schedule it',
  })
  @Type(() => Boolean)
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
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  sendEmailNotification?: boolean;

  @ApiProperty({
    example: true,
    description: 'Should the announcement be sent to all users',
    required: false,
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isForAllUsers?: boolean;

  @ApiProperty({
    example: false,
    description: 'Should read receipt tracking be enabled',
    required: false,
  })
  @Type(() => Boolean)
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

  @ApiPropertyOptional({
    type: [String],
    example: [
      'b0aa6d20-6741-4eb8-93bb-66edf79a475d',
      'b0aa6d20-6741-4eb8-93bb-66edf79a475f',
    ],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (err) {
        console.info(err);
        return [];
      }
    }
    return [];
  })
  @IsArray()
  @IsString({ each: true })
  teams?: string[];
}
