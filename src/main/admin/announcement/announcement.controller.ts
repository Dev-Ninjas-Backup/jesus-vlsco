import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateAnnouncementCategoryService } from './services/create-announcement-category.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CreateAnnouncementCategoryDto } from './dto/createAnnouncementCategory.dto';
import { GetAnnouncementCategoryService } from './services/get-announcement-category.service';
import { UpdateAnnouncementCategoryDto } from './dto/updateAnnounementCategory.dto';
import { UpdateAnnouncementCategoryService } from './services/update-announcement-category.service';
import { DeleteAnnouncementCategoryService } from './services/delete-announcement-category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createAnnouncementSwagger } from './dto/createAnnouncement.swagger';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { CreateAnnouncementDto } from './dto/createAnnouncement.dto';
import { CreateAnnouncementService } from './services/create-announcement.service';

@ApiTags('Admin -- Announcement')
@ValidateAdmin()
@ApiBearerAuth()
@Controller('admin/announcement')
export class AnnouncementController {

    constructor(private readonly createAnnouncemetnCategoryService: CreateAnnouncementCategoryService,
        private readonly getAnnouncementCategoryService: GetAnnouncementCategoryService,
        private readonly updateAnnouncementCategoryService: UpdateAnnouncementCategoryService,
        private readonly deleteAnnouncementCategoryService: DeleteAnnouncementCategoryService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly createAnnouncemetnService: CreateAnnouncementService
        
    ){}

    // Create a new announcement category
    @Post('create-category')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Announcement category creation with file upload',
        schema: {
          type: 'object',
          properties: {
            ...createAnnouncementSwagger.properties,
            file: {
              type: 'string',
              format: 'binary',
            },
          },
          required: [...createAnnouncementSwagger.required, 'file'],
        },
      })
    async createAnnouncement(@Body() dto:CreateAnnouncementDto,@UploadedFile() file: Express.Multer.File,@GetUser('userId') userId: string) {
        if (!file) {
            throw new Error('File is required for category creation.');
        }
        // You can handle the file upload here if needed, e.g., save it to a cloud service
        const uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(file.buffer, file.originalname);
        // Assuming your DTO has a field for the file URL
        const url = uploadedUrl.secure_url;
        return await this.createAnnouncemetnService.createAnnouncement(dto,url,userId);
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
