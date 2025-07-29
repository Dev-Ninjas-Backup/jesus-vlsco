import { Module } from '@nestjs/common';
import { ManageAdminService } from './manage-admin.service';
import { ManageAdminController } from './manage-admin.controller';

@Module({
  controllers: [ManageAdminController],
  providers: [ManageAdminService],
})
export class ManageAdminModule {}
