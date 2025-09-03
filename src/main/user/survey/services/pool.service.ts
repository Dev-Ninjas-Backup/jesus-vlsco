import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetAssignedSurveyDto } from '../dto/get-assigned-survey.dto';
import { PoolResponseDto } from '../dto/pool-response.dto';

@Injectable()
export class PoolService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Error getting all assigned pools')
  async getAllAssignedPools(
    userId: string,
    query: GetAssignedSurveyDto,
  ): Promise<TPaginatedResponse<any>> {
    const page = query.page || 1;
    const limit = query.limit && query.limit >= 0 ? query.limit : 5;
    // const searchTerm = query.searchTerm?.trim();

    const pools = await this.prisma.pool.findMany({
      where: {
        OR: [{ poolUser: { some: { userId } } }, { isForAll: true }],
      },
      include: {
        options: true,
        poolResponse: {
          where: { userId },
          select: { id: true },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 🔹 map to add custom field
    const result = pools.map((pool) => ({
      ...pool,
      isResponded: pool.poolResponse.length > 0,
    }));

    const totalCount = await this.prisma.pool.count({
      where: {
        OR: [{ poolUser: { some: { userId } } }, { isForAll: true }],
      },
    });

    return successPaginatedResponse(
      result,
      { page, limit, total: totalCount },
      'Pools retrieved successfully',
    );
    // return successResponse(result, 'Pools retrieved successfully');
  }

  @HandleError('Error getting single pool')
  async getSinglePool(id: string): Promise<TResponse<any>> {
    const pool = await this.prisma.pool.findUnique({
      where: {
        id,
        isTemplate: false,
      },
      include: { options: true },
    });

    if (!pool) {
      throw new AppError(404, 'Pool not found or is template');
    }

    return successResponse(pool, 'Pool retrieved successfully');
  }

  @HandleError('Error submitting response')
  async responseToAPool(
    userId: string,
    poolId: string,
    dto: PoolResponseDto,
  ): Promise<TResponse<any>> {
    // 1. get the pool
    const pool = await this.prisma.pool.findUnique({
      where: { id: poolId },
    });
    if (!pool) {
      throw new AppError(404, 'Pool not found');
    }

    // 2. Validate option belongs to pool
    const option = await this.prisma.poolOption.findFirst({
      where: { id: dto.optionId, poolId },
    });
    if (!option) {
      throw new AppError(400, 'Invalid option for this pool');
    }

    // 3. Ensure user is allowed to respond (either assigned or pool is for all)
    if (!pool.isForAll) {
      const assigned = await this.prisma.poolUser.findUnique({
        where: {
          poolId_userId: {
            poolId,
            userId,
          },
        },
      });

      if (!assigned) {
        throw new AppError(403, 'You are not assigned to this pool');
      }
    }

    // 4. Check if user has already responded
    const isResponded = await this.prisma.poolUser.findUnique({
      where: {
        poolId_userId: {
          poolId,
          userId,
        },
      },
    });
    if (isResponded) {
      throw new AppError(400, 'You have already responded to this pool');
    }

    // 5. Create / Update the pool user response record
    await this.prisma.poolUser.upsert({
      where: {
        poolId_userId: {
          poolId,
          userId,
        },
      },
      update: { isResponded: true },
      create: { poolId, userId, isResponded: true },
    });

    // 6. Create response
    const response = await this.prisma.poolResponse.create({
      data: { optionId: dto.optionId, poolId, userId },
    });

    return successResponse(response, 'Response submitted successfully');
  }
}
