import { Module } from '@nestjs/common';
import { AddBadgeService } from './services/add-badge.service';
import { AddBadgeController } from './controller/add-badge.controller';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { GetAllBadgeController } from './controller/get-all-badge.controller';
import { GetAllBadgeService } from './services/get-all-badge.service';

@Module({
  providers: [AddBadgeService,CloudinaryService, GetAllBadgeService],
  controllers: [AddBadgeController, GetAllBadgeController]
})
export class RecognitionModule {}
