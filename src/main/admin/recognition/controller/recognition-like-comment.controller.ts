// recognition-like-comment.controller.ts
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { CreateRecognitionLikeDto } from '../dto/recognition.dto';
import { CreateUpdateCommentsService } from '../services/create-update-comments.service';
import { RecognitionLikeCommentService } from '../services/recognition-like-comment.service';

@ApiTags('Admin -- Recognition Reactions & Comments')
@Controller('recognition/comments')
@ApiBearerAuth()
@ValidateAuth()
export class RecognitionLikeCommentController {
  constructor(
    private readonly service: RecognitionLikeCommentService,
    private readonly createUpdateCommentsService: CreateUpdateCommentsService,
  ) {}

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
    return this.createUpdateCommentsService.createOrUpdate({
      recognitionId,
      userId,
      comment: body.comment,
      reaction: body.reaction,
      commentId: body.commentId,
      parentCommentId: body.parentCommentId,
    });
  }

  // @Patch(':commentId')
  // async update(
  //   @Param('commentId') commentId: string,
  //   @GetUser('userId') userId: string,
  //   @Body() body: UpdateRecognitionLikeDto,
  // ) {
  //   return this.service.update(commentId, userId, body);
  // }

  @Delete(':commentId')
  async delete(
    @Param('commentId') commentId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.service.delete({ commentId, userId });
  }

  @Delete('reactions/:recognitionId')
  async deleteAllReactions(@Param('recognitionId') recognitionId: string) {
    return this.service.deleteAllReactions(recognitionId);
  }
}
