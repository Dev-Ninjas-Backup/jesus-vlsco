import { Module } from '@nestjs/common';
import { AddBadgeService } from './services/add-badge.service';
import { AddBadgeController } from './controller/add-badge.controller';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { GetAllBadgeController } from './controller/get-all-badge.controller';
import { GetAllBadgeService } from './services/get-all-badge.service';
import { AddRecognitionService } from './services/add-recognition.service';
import { AddRecognitionController } from './controller/add-recognition.controller';

@Module({
  providers: [AddBadgeService,CloudinaryService, GetAllBadgeService, AddRecognitionService],
  controllers: [AddBadgeController, GetAllBadgeController, AddRecognitionController]
})
export class RecognitionModule {}
