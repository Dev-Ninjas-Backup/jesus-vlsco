import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GetUser, ValidateAdmin } from '@project/common/jwt/jwt.decorator';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { CreateAnnouncementDto } from './dto/createAnnouncement.dto';
import { createAnnouncementSwagger } from './dto/createAnnouncement.swagger';
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
  async createAnnouncement(
    @Body() dto: CreateAnnouncementDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser('userId') userId: string,
  ) {
    let uploadedUrl = null;

    if (file) {
      uploadedUrl = await this.cloudinaryService.uploadImageFromBuffer(
        file.buffer,
        file.originalname,
      );
    }
    return await this.createAnnouncementService.createAnnouncement(
      dto,
      uploadedUrl?.url || null,
      userId,
    );
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
