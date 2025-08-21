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
    });

    if (!pool) {
      throw new AppError(404, 'Pool not found');
    }

    // const totalUsersInDb = await this.prisma.user.count();

    const result = pool.map((pool) => ({
      id: pool.id,
      title: pool.title,
      description: pool.description,
      options: pool.options.map((option) => ({
        option: option.option,
        totalResponse: option.poolResponse?.length,
      })),
    }));

    return successResponse(result, 'Pool fetched successfully');
  }
}
