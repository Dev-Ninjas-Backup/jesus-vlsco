import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { GetBadgeDto } from '../dto/get-badge.dto';

@Injectable()
export class GetAllBadgeService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Error Getting Badge')
  async getAllBadge(query: GetBadgeDto) {
    const where: any = {};

    if (query.badgeCategory) {
      where.category = query.badgeCategory;
    }

    const badges = await this.prisma.badge.findMany({ where });

    return successResponse(badges, 'Badges Fetched Successfully');
  }

  @HandleError('Error Getting Single Badge')
  async getSingleBadge(badgeId: string): Promise<TResponse<any>> {
    const badge = await this.prisma.badge.findUnique({
      where: { id: badgeId },
    });

    if (!badge) {
      throw new AppError(404, 'Badge not found');
    }

    return successResponse(badge, 'Badge Fetched Successfully');
  }
}
