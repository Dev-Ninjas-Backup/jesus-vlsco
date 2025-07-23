import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateBadgeDto } from '../dto/add-badge.dto';
import { successResponse } from '@project/common/utils/response.util';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { HandleError } from '@project/common/error/handle-error.decorator';

@Injectable()
export class UpdateBadgeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @HandleError('Failed to update badge')
  async updateBadge(id: string, dto: UpdateBadgeDto, icon_url?: string) {
    // Ensure badge exists
    const badge = await this.prisma.badge.findUniqueOrThrow({ where: { id } });

    // Use existing iconImage if no new iconUrl is provided
    const updatedData = {
      ...dto,
      iconImage: icon_url || badge.iconImage,
    };

    const result = await this.prisma.badge.update({
      where: { id },
      data: updatedData,
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
