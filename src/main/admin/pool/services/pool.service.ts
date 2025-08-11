import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreatePoolDto } from '../dto/pool.dto';

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
}
