import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { CreateAnnouncementDto } from './dto/createAnnouncement.dto';
import { createAnnouncementSwagger } from './dto/createAnnouncement.swagger';
import { CreateAnnouncementCategoryDto } from './dto/createAnnouncementCategory.dto';
import { UpdateAnnouncementCategoryDto } from './dto/updateAnnouncementCategory.dto';
import { CreateAnnouncementCategoryService } from './services/create-announcement-category.service';
import { CreateAnnouncementService } from './services/create-announcement.service';
import { DeleteAnnouncementCategoryService } from './services/delete-announcement-category.service';
import { GetAnnouncementCategoryService } from './services/get-announcement-category.service';
import { UpdateAnnouncementCategoryService } from './services/update-announcement-category.service';

@ApiTags('Admin -- Announcement')
@ValidateAdmin()
@ApiBearerAuth()
@Controller('admin/announcement')
export class AnnouncementController {
  constructor(
    private readonly createAnnouncementCategoryService: CreateAnnouncementCategoryService,
    private readonly getAnnouncementCategoryService: GetAnnouncementCategoryService,
    private readonly updateAnnouncementCategoryService: UpdateAnnouncementCategoryService,
    private readonly deleteAnnouncementCategoryService: DeleteAnnouncementCategoryService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly createAnnouncementService: CreateAnnouncementService,
  ) {}

  // Create a new announcement category
  @Post('create-announcement')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Announcement creation with file uploads',
    schema: {
      type: 'object',
      properties: {
        ...createAnnouncementSwagger.properties,
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Multiple file uploads (optional)',
        },
      },
    },
  })
  async createAnnouncement(
    @Body() dto: CreateAnnouncementDto,
    @UploadedFiles() files: Express.Multer.File[],
    @GetUser('userId') userId: string,
  ) {
    let uploadedUrls: { url: string }[] = [];

    if (files && files.length > 0) {
      uploadedUrls = await Promise.all(
        files.map(async (file) => {
          return await this.cloudinaryService.uploadImageFromBuffer(
            file.buffer,
            file.originalname,
          );
        }),
      );
    }

    return await this.createAnnouncementService.createAnnouncement(
      dto,
      uploadedUrls.map((file) => file.url), // Only pass the URL array
      userId,
    );
  }

  // Create a new announcement category
  @Post('create-category')
  async createCategory(@Body() dto: CreateAnnouncementCategoryDto) {
    return await this.createAnnouncementCategoryService.createCategory(dto);
  }

  // Get all announcement categories
  @Get('get-categories')
  async getCategories() {
    return await this.getAnnouncementCategoryService.getCategories();
  }

  // Update an existing announcement category
  @Patch('update-category/:id')
  async updateCategory(
    @Body() dto: UpdateAnnouncementCategoryDto,
    @Param('id') id: string,
  ) {
    return await this.updateAnnouncementCategoryService.updateCategory(dto, id);
  }

  // Delete an announcement category
  @Delete('delete-category/:id')
  async deleteCategory(@Param('id') id: string) {
    return await this.deleteAnnouncementCategoryService.deleteCategory(id);
  }
}
