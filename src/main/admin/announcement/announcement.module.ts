import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { CreateAnnouncementCategoryService } from './services/create-announcement-category.service';
import { GetAnnouncementCategoryService } from './services/get-announcement-category.service';
import { UpdateAnnouncementCategoryService } from './services/update-announcement-category.service';
import { DeleteAnnouncementCategoryService } from './services/delete-announcement-category.service';
import { CreateAnnouncementService } from './services/create-announcement.service';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';

@Module({
  controllers: [AnnouncementController],
  providers: [CreateAnnouncementCategoryService, GetAnnouncementCategoryService, UpdateAnnouncementCategoryService, DeleteAnnouncementCategoryService, CreateAnnouncementService,CloudinaryService]
})
export class AnnouncementModule {}
