import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateAnnouncementDto } from '../dto/createAnnouncement.dto';

@Injectable()
export class CreateAnnouncementService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new announcement
  @HandleError('Error creating announcement')
  async createAnnouncement(
    data: CreateAnnouncementDto,
    url: string | null,
    userId: string,
  ) {
    console.log(data.description);
    const announcement = await this.prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        audience: data.audience,
        createdBy: userId,
        sendEmailNotification: data.sendEmailNotification,
        enabledReadReceipt: data.enabledReadReceipt,
        categoryId: data.categoryId,
        publishedNow: data.publishedNow,
        publishedAt: data.publishedAt,
        ...(url && { attachments: { create: { file: url } } }),
      },
    });

    return successResponse(announcement, 'Announcement created successfully');
  }
}
