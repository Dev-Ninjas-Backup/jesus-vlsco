import { Module } from '@nestjs/common';
import { ServicesService } from './services/settings.service';
import { SettingsController } from './controller/settings.controller';
import { CreateCompanyService } from './services/create-company.service';

@Module({
  providers: [ServicesService, CreateCompanyService],
  controllers: [SettingsController]
})
export class SettingsModule {}
