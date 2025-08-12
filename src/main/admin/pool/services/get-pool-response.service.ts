import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class GetPoolResponseService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to get responses')
  async getPoolResponse(): Promise<TResponse<any>> {
    const pool = await this.prisma.pool.findUnique({
      select: {
        title: true,
        description: true,
        question: true,
        poolUser: { select: { id: true } },
        options: {
          select: {
            id: true,
            option: true,
            poolResponse: { select: { id: true } },
          },
        },
      },
    });

    if (!pool) {
      throw new AppError(404, 'Pool not found');
    }

    const result = {
      title: pool.title,
      description: pool.description,
      question: pool.question,
      totalAssignedUsers: pool.poolUser.length,
      options: pool.options.map((opt: any) => ({
        option: opt.option,
        responseCount: opt.poolResponse.length,
      })),
    };

    return successResponse(result, 'Pool fetched successfully');
  }
}
