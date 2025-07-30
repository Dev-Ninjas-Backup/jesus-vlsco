import { Module } from '@nestjs/common';
import { ManageAdminService } from './manage-admin.service';
import { ManageAdminController } from './manage-admin.controller';
import { CloudinaryService } from '@project/lib/cloudinary/cloudinary.service';

@Module({
  controllers: [ManageAdminController],
  providers: [ManageAdminService,CloudinaryService],
})
export class ManageAdminModule {}
