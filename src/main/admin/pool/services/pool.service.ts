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
import { CreatePoolDto, UpdatePoolDto } from '../dto/pool.dto';

@Injectable()
export class PoolService {
  constructor(private readonly prisma: PrismaService) {}

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

  @HandleError('Failed to update pool')
  async updatePool(
    poolId: string,
    dto: UpdatePoolDto,
  ): Promise<TResponse<any>> {
    const { employees, options = [], ...rest } = dto;

    // Fetch existing options and users for this pool
    const existingPool = await this.prisma.pool.findUnique({
      where: { id: poolId },
      include: { options: true, poolUser: true },
    });
    if (!existingPool) throw new AppError(404, 'Pool not found');

    // === Update pool basic info ===
    await this.prisma.pool.update({
      where: { id: poolId },
      data: { ...rest, isTemplate: false },
    });

    // === Handle pool options ===
    // 1. Identify options to delete (those in DB but not in DTO)
    const optionStringsToKeep = new Set(options);
    const optionsToDelete = existingPool.options.filter(
      (opt) => !optionStringsToKeep.has(opt.option),
    );

    // 2. Identify new options to add (those in DTO but not in DB)
    const existingOptionStrings = new Set(
      existingPool.options.map((opt) => opt.option),
    );
    const optionsToAdd = options.filter(
      (opt) => !existingOptionStrings.has(opt),
    );

    // === Handle pool users ===
    // 1. Identify users to delete (removed from DTO)
    const employeesSet = new Set(employees || []);
    const usersToDelete = existingPool.poolUser.filter(
      (pu) => !employeesSet.has(pu.userId),
    );

    // 2. Identify users to add (new users)
    const existingUserIds = new Set(
      existingPool.poolUser.map((pu) => pu.userId),
    );
    const usersToAdd = (employees || []).filter((u) => !existingUserIds.has(u));

    // === Perform transaction ===
    const updatedPool = await this.prisma.$transaction(async (tx) => {
      // Update basic pool fields
      await tx.pool.update({
        where: { id: poolId },
        data: {
          ...rest,
          updatedAt: new Date(),
        },
      });

      // Delete removed options
      for (const opt of optionsToDelete) {
        await tx.poolOption.delete({ where: { id: opt.id } });
      }

      // Add new options
      if (optionsToAdd.length) {
        await tx.poolOption.createMany({
          data: optionsToAdd.map((option) => ({
            poolId,
            option,
          })),
        });
      }

      // Delete removed users
      for (const pu of usersToDelete) {
        await tx.poolUser.delete({ where: { id: pu.id } });
      }

      // Add new users
      if (usersToAdd.length) {
        await tx.poolUser.createMany({
          data: usersToAdd.map((userId) => ({
            poolId,
            userId,
          })),
        });
      }

      // Finally, fetch and return updated pool with relations
      return tx.pool.findUnique({
        where: { id: poolId },
        include: {
          options: true,
          poolUser: true,
          poolResponse: true,
        },
      });
    });

    return successResponse(updatedPool, 'Pool updated successfully');
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
        where: {
          isTemplate: false,
        },
      }),
    ]);

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
