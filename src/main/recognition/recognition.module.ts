import { Module } from '@nestjs/common';
import { AddBadgeService } from './services/add-badge.service';
import { AddBadgeController } from './controller/add-badge.controller';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';

@Module({
  providers: [AddBadgeService,CloudinaryService],
  controllers: [AddBadgeController]
})
export class RecognitionModule {}
