import { Module } from '@nestjs/common';
import { ManageAdminModule } from './manage-admin/manage-admin.module';

@Module({
  imports: [ManageAdminModule],
})
export class SuperadminModule {}
