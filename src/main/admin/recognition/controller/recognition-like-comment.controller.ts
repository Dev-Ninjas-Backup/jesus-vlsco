// recognition-like-comment.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import {
  CreateRecognitionLikeDto,
  UpdateRecognitionLikeDto,
} from '../dto/recognition.dto';
import { RecognitionLikeCommentService } from '../services/recognition-like-comment.service';

@ApiTags('Recognition Like Comment')
@Controller('recognition/comments')
@ApiBearerAuth()
@ValidateAuth()
export class RecognitionLikeCommentController {
  constructor(private readonly service: RecognitionLikeCommentService) {}

  @Get('list/:recognitionId')
  async list(@Param('recognitionId') recognitionId: string) {
    return this.service.getThreadedComments(recognitionId);
  }

  @Get('thread/:rootCommentId')
  async threadByRoot(@Param('rootCommentId') rootCommentId: string) {
    return await this.service.getThreadByRoot(rootCommentId);
  }

  @Post(':recognitionId')
  async create(
    @Param('recognitionId') recognitionId: string,
    @GetUser('userId') userId: string,
    @Body() body: CreateRecognitionLikeDto,
  ) {
    return this.service.create({
      recognitionId,
      recognitionUserId: userId,
      comment: body.comment,
      reaction: body.reaction,
      parentCommentId: body.parentCommentId,
    });
  }

  @Patch(':commentId')
  async update(
    @Param('commentId') commentId: string,
    @GetUser('userId') userId: string,
    @Body() body: UpdateRecognitionLikeDto,
  ) {
    return this.service.update(commentId, userId, body);
  }

  @Delete(':commentId')
  async delete(
    @Param('commentId') commentId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.service.delete({ commentId, userId });
  }
}
