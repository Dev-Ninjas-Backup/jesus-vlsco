import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateAnnouncementCategoryDto } from '../dto/updateAnnounementCategory.dto';

@Injectable()
export class UpdateAnnouncementCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // Update an existing announcement category
  @HandleError('Error updating announcement category')
  async updateCategory(dto: UpdateAnnouncementCategoryDto, id: string) {
    const updatedCategory = await this.prisma.announcementCategory.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    return successResponse(
      updatedCategory,
      'Announcement category updated successfully',
    );
  }
}
