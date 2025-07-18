import { Module } from '@nestjs/common';
import { AddBadgeService } from './services/add-badge.service';
import { AddBadgeController } from './controller/add-badge.controller';

@Module({
  providers: [AddBadgeService],
  controllers: [AddBadgeController]
})
export class RecognitionModule {}
