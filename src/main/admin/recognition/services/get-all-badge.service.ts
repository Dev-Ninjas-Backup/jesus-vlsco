import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
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
}
