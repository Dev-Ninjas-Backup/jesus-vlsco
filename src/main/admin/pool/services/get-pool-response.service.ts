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
    const pool = await this.prisma.pool.findMany({
      include: {
        options: {
          include: {
            poolResponse: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!pool) {
      throw new AppError(404, 'Pool not found');
    }

    const result = pool.map((pool) => {
      // total responses across all options for this pool
      const totalResponses = pool.options.reduce(
        (sum, option) => sum + option.poolResponse.length,
        0,
      );

      return {
        id: pool.id,
        title: pool.title,
        description: pool.description,
        totalResponse: totalResponses,
        options: pool.options.map((option) => {
          const optionResponses = option.poolResponse.length;
          return {
            option: option.option,
            totalResponse: optionResponses,
            responsePercentage:
              totalResponses > 0 ? (optionResponses / totalResponses) * 100 : 0,
          };
        }),
      };
    });

    return successResponse(result, 'Pool fetched successfully');
  }
}
