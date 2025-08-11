import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreatePoolDto } from '../dto/pool.dto';

@Injectable()
export class PoolService {
  constructor(private readonly prisma: PrismaService) { }

  @HandleError('Failed to create pool')
  async createPool(dto: CreatePoolDto): Promise<TResponse<any>> {
    const { employees, ...rest } = dto;

    const pool = await this.prisma.pool.create({
      data: {
        ...rest,
        options: {
          createMany: {
            data:
              dto?.options?.map((option) => ({
                option,
              })) || [],
          },
        },
        poolUser: {
          createMany: {
            data:
              employees?.map((user) => ({
                userId: user,
              })) || [],
          },
        },
      },
      include: {
        options: true,
        poolUser: true,
        poolResponse: true,
      },
    });

    return successResponse(pool, 'Pool created successfully');
  }

  @HandleError('Failed to get pools')
  async getPools(query: PaginationDto): Promise<TPaginatedResponse<any>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 5;
    const skip = (page - 1) * limit;

    const [totalCount, pools] = await this.prisma.$transaction([
      this.prisma.pool.count(),
      this.prisma.pool.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          options: true,
          poolUser: true,
          poolResponse: true,
        },
      })
    ])

    return successPaginatedResponse(
      pools,
      { page, limit, total: totalCount },
      'Pools retrieved successfully',
    );
  }

  @HandleError('Failed to get pool')
  async getPool(id: string): Promise<TResponse<any>> {
    const pool = await this.prisma.pool.findUnique({
      where: { id },
      include: {
        options: true,
        poolUser: true,
        poolResponse: true,
      },
    });

    if (!pool) {
      throw new AppError(404, 'Pool not found');
    }

    return successResponse(pool, 'Pool retrieved successfully');
  }

  @HandleError('Failed to delete pool')
  async deletePool(id: string): Promise<TResponse<any>> {
    await this.prisma.pool.delete({ where: { id } });

    return successResponse(null, 'Pool deleted successfully');
  }
}
