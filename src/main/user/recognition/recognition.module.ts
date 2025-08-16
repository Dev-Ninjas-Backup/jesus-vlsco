import { Module } from '@nestjs/common';
import { RecognitionLikeCommentService } from '@project/main/admin/recognition/services/recognition-like-comment.service';
import { RecognitionController } from './recognition.controller';
import { RecognitionService } from './recognition.service';
import { CreateUpdateCommentsService } from '@project/main/admin/recognition/services/create-update-comments.service';

@Module({
  controllers: [RecognitionController],
  providers: [
    RecognitionService,
    RecognitionLikeCommentService,
    CreateUpdateCommentsService,
  ],
})
export class RecognitionModule {}
