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
  user: {
    id: string;
    firstName: string;
    lastName: string | null;
    profileUrl: string | null;
    jobTitle: string;
  } | null;
  replies: ThreadNode[];
  reactions: ThreadNode[];
};

@Injectable()
export class RecognitionLikeCommentService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to create comment')
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

  @HandleError('Failed to get comments and reactions')
  async getThreadedComments(
    recognitionId: string,
  ): Promise<TResponse<{ comments: ThreadNode[]; reactions: ThreadNode[] }>> {
    const all = await this.prisma.recognitionLikeComment.findMany({
      where: { recognitionId },
      orderBy: { createdAt: 'desc' },
      include: {
        recognitionUser: {
          include: { user: { include: { profile: true } } },
        },
        commenterOfRecognition: { include: { profile: true } },
      },
    });

    const byId = new Map<string, ThreadNode>();
    const rootComments: ThreadNode[] = [];
    const rootReactions: ThreadNode[] = [];

    for (const c of all) {
      const userProfile =
        c.recognitionUser?.user?.profile ??
        c.commenterOfRecognition?.profile ??
        null;

      byId.set(c.id, {
        id: c.id,
        comment: c.comment ?? null,
        reaction: c.reaction ?? null,
        recognitionId: c.recognitionId,
        recognitionUserId: c.recognitionUserId ?? c.commenterId ?? '',
        parentCommentId: c.parentCommentId ?? null,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        user: userProfile
          ? {
              id: userProfile.userId,
              firstName: userProfile.firstName,
              lastName: userProfile.lastName,
              profileUrl: userProfile.profileUrl,
              jobTitle: userProfile.jobTitle,
            }
          : null,
        replies: [],
        reactions: [],
      });
    }

    for (const node of byId.values()) {
      if (node.parentCommentId) {
        const parent = byId.get(node.parentCommentId);
        if (!parent) continue;

        if (node.comment) {
          parent.replies.push(node); // only comments can be replies
        } else if (node.reaction) {
          parent.reactions.push(node); // reactions attach to comment parent
        }
      } else {
        // root node
        if (node.comment) rootComments.push(node);
        else if (node.reaction) rootReactions.push(node);
      }
    }

    return successResponse(
      { comments: rootComments, reactions: rootReactions },
      'Comments and reactions fetched successfully',
    );
  }

  @HandleError('Failed to get thread by root')
  async getThreadByRoot(rootCommentId: string): Promise<TResponse<ThreadNode>> {
    const root = await this.prisma.recognitionLikeComment.findUnique({
      where: { id: rootCommentId },
    });
    if (!root) throw new AppError(404, 'Comment not found');

    const forest = await this.getThreadedComments(root.recognitionId);

    const thread = forest.data.comments.find((c) => c.id === rootCommentId);
    if (thread) {
      return successResponse(thread, 'Thread fetched successfully');
    }

    throw new AppError(400, 'Root thread not found');
  }
}
