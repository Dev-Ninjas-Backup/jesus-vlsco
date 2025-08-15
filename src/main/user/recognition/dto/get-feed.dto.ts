import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export enum RecognitionFeedType {
  ALL = 'all',
  MY = 'my',
  SHEARED_WITH_ME = 'sharedWithMe',
}

export class GetRecognitionFeed {
  @ApiPropertyOptional({
    enum: RecognitionFeedType,
    default: RecognitionFeedType.ALL,
  })
  @Transform(({ value }) => {
    if (value === 'my') return RecognitionFeedType.MY;
    if (value === 'sharedWithMe') return RecognitionFeedType.SHEARED_WITH_ME;
    return RecognitionFeedType.ALL;
  })
  @IsEnum(RecognitionFeedType)
  @IsOptional()
  type?: RecognitionFeedType;
}
