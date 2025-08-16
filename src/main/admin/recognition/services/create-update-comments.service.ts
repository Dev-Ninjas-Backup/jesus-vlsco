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

    //  CASE 1: Handle reaction (always upsert)
    if (reaction) {
      // Determine the filter based on recognitionUser or commenter
      const filter: any = {
        recognitionId,
        parentCommentId: parentCommentId ?? null,
      };
      if (recognitionUser) {
        filter.recognitionUserId = userId;
      } else {
        filter.commenterId = userId;
      }

      // Check if reaction exists
      const existingReaction =
        await this.prisma.recognitionLikeComment.findFirst({
          where: {
            ...filter,
            reaction: { not: null },
          },
        });

      let newReaction;
      if (existingReaction) {
        // Update existing reaction
        newReaction = await this.prisma.recognitionLikeComment.update({
          where: { id: existingReaction.id },
          data: { reaction },
        });
      } else {
        // Create new reaction
        newReaction = await this.prisma.recognitionLikeComment.create({
          data: {
            ...filter,
            reaction,
          },
        });
      }

      return successResponse(newReaction, 'Reaction saved successfully');
    }

    // CASE 2: Handle comment (update if commentId provided else create)
    if (commentId) {
      const updatedComment = await this.prisma.recognitionLikeComment.update({
        where: { id: commentId },
        data: { comment },
      });

      return successResponse(updatedComment, 'Comment updated successfully');
    } else if (comment) {
      const newComment = await this.prisma.recognitionLikeComment.create({
        data: {
          recognitionId,
          comment,
          parentCommentId,
          ...(recognitionUser
            ? { recognitionUserId: userId }
            : { commenterId: userId }),
        },
      });

      return successResponse(newComment, 'Comment created successfully');
    }

    throw new AppError(400, 'Either comment or reaction must be provided');
  }
}
