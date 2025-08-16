import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AddBadgeController } from './controller/add-badge.controller';
import { AddRecognitionController } from './controller/add-recognition.controller';
import { GetAllBadgeController } from './controller/get-all-badge.controller';
import { GetRecognitionController } from './controller/get-recognition.controller';
import { RecognitionLikeCommentController } from './controller/recognition-like-comment.controller';
import { UpdateBadgeController } from './controller/update-badge.controller';
import { UpdateRecognitionController } from './controller/update-recognition.controller';
import { AddBadgeService } from './services/add-badge.service';
import { AddRecognitionService } from './services/add-recognition.service';
import { GetAllBadgeService } from './services/get-all-badge.service';
import { GetRecognitionService } from './services/get-recognition.service';
import { RecognitionLikeCommentService } from './services/recognition-like-comment.service';
import { UpdateBadgeService } from './services/update-badge.service';
import { UpdateRecognitionService } from './services/update-recognition.service';
import { CreateUpdateCommentsService } from './services/create-update-comments.service';

@Module({
  providers: [
    AddBadgeService,
    CloudinaryService,
    GetAllBadgeService,
    AddRecognitionService,
    UpdateBadgeService,
    UpdateRecognitionService,
    GetRecognitionService,
    RecognitionLikeCommentService,
    CreateUpdateCommentsService,
  ],
  controllers: [
    AddBadgeController,
    GetAllBadgeController,
    AddRecognitionController,
    UpdateBadgeController,
    UpdateRecognitionController,
    GetRecognitionController,
    RecognitionLikeCommentController,
  ],
})
export class RecognitionModule {}
