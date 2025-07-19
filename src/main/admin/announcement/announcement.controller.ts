import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CreateAnnouncementCategoryService } from './services/create-announcement-category.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreateAnnouncementCategoryDto } from './dto/createAnnouncementCategory.dto';
import { GetAnnouncementCategoryService } from './services/get-announcement-category.service';
import { UpdateAnnouncementCategoryDto } from './dto/updateAnnounementCategory.dto';
import { UpdateAnnouncementCategoryService } from './services/update-announcement-category.service';
import { DeleteAnnouncementCategoryService } from './services/delete-announcement-category.service';

@ApiTags('Admin -- Announcement')
@ValidateAdmin()
@ApiBearerAuth()
@Controller('admin/announcement')
export class AnnouncementController {

    constructor(private readonly createAnnouncemetnCategoryService: CreateAnnouncementCategoryService,
        private readonly getAnnouncementCategoryService: GetAnnouncementCategoryService,
        private readonly updateAnnouncementCategoryService: UpdateAnnouncementCategoryService,
        private readonly deleteAnnouncementCategoryService: DeleteAnnouncementCategoryService
        
    ){}

    // Create a new announcement category
    @Post('create-category')
    async createCategory(@Body() dto:CreateAnnouncementCategoryDto) {
        return await this.createAnnouncemetnCategoryService.createCategory(dto);
    }

    // Get all announcement categories
    @Get('get-categories')
    async getCategories() {
        return await this.getAnnouncementCategoryService.getCategories();
    }

    // Update an existing announcement category
    @Patch('update-category/:id')
    async updateCategory(@Body() dto:UpdateAnnouncementCategoryDto, @Param('id') id:string) {
        return await this.updateAnnouncementCategoryService.updateCategory(dto, id);
    }

    // Delete an announcement category
    @Delete('delete-category/:id')
    async deleteCategory(@Param('id') id:string) {
        return await this.deleteAnnouncementCategoryService.deleteCategory(id);
    }
}
