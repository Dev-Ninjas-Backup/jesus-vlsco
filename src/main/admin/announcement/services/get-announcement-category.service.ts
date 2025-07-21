import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class GetAnnouncementCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all announcement categories
  @HandleError('Error retrieving announcement categories')
  async getCategories() {
    const categories = await this.prisma.announcementCategory.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!categories || categories.length === 0) {
      throw new Error('No announcement categories found');
    }

    return successResponse(
      categories,
      'Announcement categories retrieved successfully',
    );
  }
}
