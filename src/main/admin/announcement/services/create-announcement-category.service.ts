import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateAnnouncementCategoryDto } from '../dto/createAnnouncementCategory.dto';

@Injectable()
export class CreateAnnouncementCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new announcement category
  @HandleError('Error creating announcement category')
  async createCategory(dto: CreateAnnouncementCategoryDto) {
    const category = await this.prisma.announcementCategory.create({
      data: {
        ...dto,
      },
    });

    return successResponse(
      category,
      'Announcement category created successfully',
    );
  }
}
