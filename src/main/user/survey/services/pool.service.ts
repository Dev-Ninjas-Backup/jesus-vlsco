import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
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
  ): Promise<TResponse<any>> {
    const page = query.page || 1;
    const limit = query.limit && query.limit >= 0 ? query.limit : 5;
    // const searchTerm = query.searchTerm?.trim();

    const pools = await this.prisma.pool.findMany({
      where: {
        poolUser: {
          some: {
            userId,
          },
        },
        // OR: [
        //   {
        //     title: {
        //       contains: searchTerm,
        //       mode: 'insensitive',
        //     },
        //   },
        //   {
        //     description: {
        //       contains: searchTerm,
        //       mode: 'insensitive',
        //     },
        //   },
        // ],
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(pools, 'Pools retrieved successfully');
  }

  @HandleError('Error getting single pool')
  async getSinglePool(id: string): Promise<TResponse<any>> {
    const pool = await this.prisma.pool.findUnique({
      where: {
        id,
        isTemplate: false,
        poolUser: { some: { isResponded: false } },
      },
      include: { options: true },
    });

    if (!pool) {
      throw new AppError(
        404,
        'Pool not found or already responded or is template',
      );
    }

    return successResponse(pool, 'Pool retrieved successfully');
  }

  @HandleError('Error submitting response')
  async responseToAPool(
    userId: string,
    poolId: string,
    dto: PoolResponseDto,
  ): Promise<TResponse<any>> {
    const response = await this.prisma.poolResponse.create({
      data: { optionId: dto.optionId, poolId, userId },
    });

    return successResponse(response, 'Response submitted successfully');
  }
}
