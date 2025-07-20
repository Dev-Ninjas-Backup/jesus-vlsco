import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class DeleteAnnouncementCategoryService {

    constructor(private readonly prisma: PrismaService) {}

    // Delete an announcement category by ID
    @HandleError('Error deleting announcement category')
    async deleteCategory(id: string) {
        const deletedCategory = await this.prisma.announcementCategory.delete({
            where: { id },
        });

        return successResponse(deletedCategory, 'Announcement category deleted successfully');
    }
}
