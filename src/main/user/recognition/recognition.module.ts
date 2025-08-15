import { Module } from '@nestjs/common';
import { RecognitionLikeCommentService } from '@project/main/admin/recognition/services/recognition-like-comment.service';
import { RecognitionController } from './recognition.controller';
import { RecognitionService } from './recognition.service';

@Module({
  controllers: [RecognitionController],
  providers: [RecognitionService, RecognitionLikeCommentService],
})
export class RecognitionModule {}
