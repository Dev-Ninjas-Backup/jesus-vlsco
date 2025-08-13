import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateBadgeDto } from '../dto/add-badge.dto';

@Injectable()
export class UpdateBadgeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @HandleError('Failed to update badge')
  async updateBadge(id: string, dto: UpdateBadgeDto, icon_url: string | null) {
    // Ensure badge exists
    const badge = await this.prisma.badge.findUniqueOrThrow({ where: { id } });

    const result = await this.prisma.badge.update({
      where: { id },
      data: {
        ...(dto.title && dto.title.trim() !== '' && { title: dto.title }),
        ...(dto.category && { category: dto.category }),
        ...(icon_url && { iconImage: icon_url }),
      },
    });

    if (icon_url) {
      await this.cloudinaryService.deleteImage(badge.iconImage);
    }

    return successResponse(result, 'Badge Updated');
  }

  //Deleted Badge
  @HandleError('Failed to delete badge')
  async deleteBadge(id: string) {
    // Ensure badge exists
    const badge = await this.prisma.badge.findUniqueOrThrow({ where: { id } });
    const result = await this.prisma.badge.delete({
      where: { id },
    });
    await this.cloudinaryService.deleteImage(badge.iconImage);
    return successResponse(result, 'Badge Deleted');
  }
}
