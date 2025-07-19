import { Module } from '@nestjs/common';
import { SettingsController } from './controller/settings.controller';
import { CreateCompanyService } from './services/create-company.service';
import { UpdateCompanyService } from './services/update-company.service';
import { SettingsService } from './services/settings.service';
import { AddBranchService } from './services/add-branch.service';

@Module({
  providers: [SettingsService, CreateCompanyService, UpdateCompanyService, AddBranchService],
  controllers: [SettingsController]
})
export class SettingsModule {}
