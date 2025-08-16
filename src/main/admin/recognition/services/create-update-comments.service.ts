import { Injectable } from '@nestjs/common';
import { Reaction } from '@prisma/client';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class CreateUpdateCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to create or update comment or reaction')
  async createOrUpdate({
    recognitionId,
    userId,
    comment,
    reaction,
    commentId,
    parentCommentId,
  }: {
    recognitionId: string;
    userId: string;
    comment?: string;
    reaction?: Reaction;
    commentId?: string;
    parentCommentId?: string;
  }): Promise<TResponse<any>> {
    const recognition = await this.prisma.recognition.findUnique({
      where: { id: recognitionId },
    });
    if (!recognition) throw new AppError(404, 'Recognition not found');

    // 🚨 Validation: cannot create both comment and reaction at the same time
    if (comment && reaction) {
      throw new AppError(400, 'Cannot create both a comment and a reaction');
    }

    if (parentCommentId) {
      const parent = await this.prisma.recognitionLikeComment.findUnique({
        where: { id: parentCommentId },
      });
      if (!parent) throw new AppError(404, 'Parent comment not found');
      if (parent.recognitionId !== recognitionId) {
        throw new AppError(
          401,
          'Parent comment belongs to a different recognition',
        );
      }

      // 🚨 Validation: parent must be a comment, not a reaction
      if (!parent.comment) {
        throw new AppError(400, 'Cannot reply to a reaction');
      }
    }

    // Check if user is part of RecognitionUser
    const recognitionUser = await this.prisma.recognitionUser.findUnique({
      where: {
        recognitionId_userId: { recognitionId, userId },
      },
    });

    const data: any = {
      recognitionId,
      comment,
      reaction,
      parentCommentId,
    };

    if (recognitionUser) {
      data.recognitionUserId = userId;
    } else {
      data.commenterId = userId;
    }

    const newComment = await this.prisma.recognitionLikeComment.create({
      data,
    });

    return successResponse(newComment, 'Comment created successfully');
  }
}
