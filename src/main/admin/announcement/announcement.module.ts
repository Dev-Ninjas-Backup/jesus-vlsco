import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';
import { AnnouncementController } from './announcement.controller';
import { CreateAnnouncementCategoryService } from './services/create-announcement-category.service';
import { CreateAnnouncementService } from './services/create-announcement.service';
import { DeleteAnnouncementCategoryService } from './services/delete-announcement-category.service';
import { GetAnnouncementCategoryService } from './services/get-announcement-category.service';
import { UpdateAnnouncementCategoryService } from './services/update-announcement-category.service';

@Module({
  controllers: [AnnouncementController],
  providers: [
    CreateAnnouncementCategoryService,
    GetAnnouncementCategoryService,
    UpdateAnnouncementCategoryService,
    DeleteAnnouncementCategoryService,
    CreateAnnouncementService,
    CloudinaryService,
  ],
  imports: [
    BullModule.registerQueue({
      name: 'notification', // * MUST match the @InjectQueue('notification')
    }),
  ],
})
export class AnnouncementModule {}
