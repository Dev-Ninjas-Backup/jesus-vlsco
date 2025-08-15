import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reaction } from '@prisma/client';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

export type ThreadNode = {
  id: string;
  comment: string | null;
  reaction: Reaction | null;
  recognitionId: string;
  recognitionUserId: string;
  parentCommentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  replies: ThreadNode[];
};

@Injectable()
export class RecognitionLikeCommentService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to create comment')
  async create({
    recognitionId,
    userId,
    comment,
    reaction,
    parentCommentId,
  }: {
    recognitionId: string;
    userId: string;
    comment?: string;
    reaction?: Reaction;
    parentCommentId?: string;
  }): Promise<TResponse<any>> {
    const recognition = await this.prisma.recognition.findUnique({
      where: { id: recognitionId },
    });
    if (!recognition) throw new AppError(404, 'Recognition not found');

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

  @HandleError('Failed to update comment')
  async update(
    commentId: string,
    userId: string,
    data: { comment?: string; reaction?: Reaction },
  ): Promise<TResponse<any>> {
    const existing = await this.prisma.recognitionLikeComment.findUnique({
      where: { id: commentId },
    });
    if (!existing) throw new AppError(404, 'Comment not found');

    // Author check for both flows
    if (
      existing.recognitionUserId !== userId &&
      existing.commenterId !== userId
    ) {
      throw new AppError(403, 'Not your comment');
    }

    const updated = await this.prisma.recognitionLikeComment.update({
      where: { id: commentId },
      data,
    });

    return successResponse(updated, 'Comment updated successfully');
  }

  @HandleError('Failed to delete comment')
  async delete({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }): Promise<TResponse<any>> {
    const existing = await this.prisma.recognitionLikeComment.findUnique({
      where: { id: commentId },
    });
    if (!existing) throw new NotFoundException('Comment not found');

    if (
      existing.recognitionUserId !== userId &&
      existing.commenterId !== userId
    ) {
      throw new ForbiddenException('Not your comment');
    }

    const deleted = await this.prisma.recognitionLikeComment.delete({
      where: { id: commentId },
    });

    return successResponse(deleted, 'Comment deleted successfully');
  }

  @HandleError('Failed to delete all reactions')
  async deleteAllReactions(recognitionId: string): Promise<TResponse<any>> {
    const comments = await this.prisma.recognitionLikeComment.deleteMany({
      where: { recognitionId },
    });
    return successResponse(comments, 'All reactions deleted successfully');
  }

  @HandleError('Failed to get comments')
  async getThreadedComments(
    recognitionId: string,
  ): Promise<TResponse<ThreadNode[]>> {
    // Fetch all comments for a recognition in one query
    const all = await this.prisma.recognitionLikeComment.findMany({
      where: { recognitionId },
      orderBy: { createdAt: 'desc' }, // Sort latest first
      include: {
        recognitionUser: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
        commenterOfRecognition: {
          include: { profile: true },
        },
      },
    });

    // Build an index
    const byId = new Map<string, ThreadNode>();
    const roots: ThreadNode[] = [];

    // Prime nodes
    for (const c of all) {
      byId.set(c.id, {
        id: c.id,
        comment: c.comment ?? null,
        reaction: c.reaction ?? null,
        recognitionId: c.recognitionId,
        recognitionUserId: c.recognitionUserId ?? c.commenterId ?? '',
        parentCommentId: c.parentCommentId ?? null,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        replies: [],
      });
    }

    // Link children to parents
    for (const node of byId.values()) {
      if (node.parentCommentId) {
        const parent = byId.get(node.parentCommentId);
        if (parent) parent.replies.push(node);
        else roots.push(node); // orphan safety: treat as root if parent missing
      } else {
        roots.push(node);
      }
    }

    return successResponse(roots, 'Comments fetched successfully');
  }

  @HandleError('Failed to get thread by root')
  async getThreadByRoot(rootCommentId: string): Promise<TResponse<ThreadNode>> {
    const root = await this.prisma.recognitionLikeComment.findUnique({
      where: { id: rootCommentId },
    });
    if (!root) throw new AppError(404, 'Comment not found');

    const forest = await this.getThreadedComments(root.recognitionId);
    const stack = [...forest.data];
    while (stack.length) {
      const node = stack.pop()!;
      if (node.id === rootCommentId) {
        stack.push(...node.replies);
        return successResponse(node, 'Root comment found');
      }
    }

    throw new AppError(400, 'Root thread not found');
  }
}
