// recognition-like-comment.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Reaction } from '@prisma/client';
import { GetUser, ValidateAuth } from '@project/common/jwt/jwt.decorator';
import { RecognitionLikeCommentService } from '../services/recognition-like-comment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Recognition Like Comment')
@Controller('recognition/:recognitionId/comments')
@ApiBearerAuth()
@ValidateAuth()
export class RecognitionLikeCommentController {
  constructor(private readonly service: RecognitionLikeCommentService) {}

  @Get()
  async list(
    @Param('recognitionId') recognitionId: string,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Query('depth') depth?: string,
  ) {
    const depthLimit = depth !== undefined ? Number(depth) : undefined;
    return this.service.getThreadedComments(recognitionId, sort, depthLimit);
  }

  @Get('thread/:rootId')
  async threadByRoot(
    @Param('recognitionId') recognitionId: string,
    @Param('rootId') rootId: string,
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
  ) {
    // (Optional) you can enforce the recognitionId matches the root's here by checking after fetch.
    const node = await this.service.getThreadByRoot(rootId, sort);
    if (node.data.recognitionId !== recognitionId) {
      // Prevent cross-recognition leakage
      return { error: 'Root comment belongs to a different recognition' };
    }
    return node;
  }

  @Post()
  async create(
    @Param('recognitionId') recognitionId: string,
    @GetUser('userId') userId: string,
    @Body()
    body: { comment?: string; reaction?: Reaction; parentCommentId?: string },
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
    @Body() body: { comment?: string; reaction?: Reaction },
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
