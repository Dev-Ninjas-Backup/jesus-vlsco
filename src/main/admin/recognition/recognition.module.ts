import { Module } from '@nestjs/common';
import { AddBadgeService } from './services/add-badge.service';
import { AddBadgeController } from './controller/add-badge.controller';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { GetAllBadgeController } from './controller/get-all-badge.controller';
import { GetAllBadgeService } from './services/get-all-badge.service';
import { AddRecognitionService } from './services/add-recognition.service';
import { AddRecognitionController } from './controller/add-recognition.controller';
import { UpdateBadgeService } from './services/update-badge.service';
import { UpdateBadgeController } from './controller/update-badge.controller';
import { UpdateRecognitionController } from './controller/update-recognition.controller';
import { UpdateRecognitionService } from './services/update-recognition.service';
import { GetRecognitionController } from './controller/get-recognition.controller';
import { GetRecognitionService } from './services/get-recognition.service';

@Module({
  providers: [
    AddBadgeService,
    CloudinaryService,
    GetAllBadgeService,
    AddRecognitionService,
    UpdateBadgeService,
    UpdateRecognitionService,
    GetRecognitionService,
  ],
  controllers: [
    AddBadgeController,
    GetAllBadgeController,
    AddRecognitionController,
    UpdateBadgeController,
    UpdateRecognitionController,
    GetRecognitionController,
  ],
})
export class RecognitionModule {}
