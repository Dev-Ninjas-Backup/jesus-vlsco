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
    async createAnnouncement(data: CreateAnnouncementDto,url:string,userId: string) {
        const announcement = await this.prisma.announcement.create({
            data:{
                createdBy: userId,
                title:data.title,
                description: data.description,
                audience:data.audience,
                sendEmailNotification:data.sendEmailNotification,
                enabledReadReceipt: data.enabledReadReceipt,
                categoryId: data.categoryId,
            }
        });

        return successResponse(announcement, 'Announcement created successfully');
    }
}
