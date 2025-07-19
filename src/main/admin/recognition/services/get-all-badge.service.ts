import { Injectable } from '@nestjs/common';
import { BadgeCategory } from '@prisma/client';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class GetAllBadgeService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Error Geting Badge')
  async getAllBadge() {
    const badges = await this.prisma.badge.findMany();
    const grouped = badges.reduce(
      (acc, badge) => {
        const category = badge.category as BadgeCategory;
        if (!acc[category]) acc[category] = [];
        acc[category].push(badge);
        return acc;
      },
      {} as Record<BadgeCategory, typeof badges>,
    );

    return successResponse(grouped, 'Badges Fetched Successfully');
  }
}
