import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { AddBadgeDto } from '../dto/add-badge.dto';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';

@Injectable()
export class AddBadgeService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Error Adding Badge')
  async addBadge(
    dto: AddBadgeDto,
    uploadedUrl: string,
  ): Promise<TResponse<any>> {
    const badge = await this.prisma.badge.create({
      data: {
        title: dto.title,
        category: dto.category,
        iconImage: uploadedUrl,
      },
    });

    return successResponse(badge, 'Badge Created Successfully');
  }
}
