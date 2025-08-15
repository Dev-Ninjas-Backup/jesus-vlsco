import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { RecognitionLikeCommentService } from '@project/main/admin/recognition/services/recognition-like-comment.service';
import { GetRecognitionFeed } from './dto/get-feed.dto';

@Injectable()
export class RecognitionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recognitionLikeCommentService: RecognitionLikeCommentService,
  ) {}

  @HandleError('Failed to get recognition feed')
  async getRecognitionFeed(
    userId: string,
    dto: GetRecognitionFeed,
  ): Promise<TResponse<any>> {
    let where: any = {};

    switch (dto.type) {
      case 'my':
        where = {
          recognitionUsers: {
            some: { userId },
          },
        };
        break;

      case 'sharedWithMe':
        where = {
          recognitionUsers: {
            none: { userId },
          },
        };
        break;

      default:
        where = {};
    }

    const recognitions = await this.prisma.recognition.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        recognitionUsers: {
          include: {
            user: { include: { profile: true } },
          },
        },
      },
    });

    // Attach threaded comments to each recognition
    const enriched = await Promise.all(
      recognitions.map(async (rec) => {
        const threadRes =
          await this.recognitionLikeCommentService.getThreadedComments(rec.id);

        return {
          ...rec,
          comments: threadRes.data.comments,
          reactions: threadRes.data.reactions,
        };
      }),
    );

    return successResponse(enriched, 'Recognition feed retrieved successfully');
  }
}
