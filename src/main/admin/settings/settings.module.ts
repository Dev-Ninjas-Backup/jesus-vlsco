import { Module } from '@nestjs/common';
import { ServicesService } from './services/settings.service';
import { SettingsController } from './controller/settings.controller';

@Module({
  providers: [ServicesService],
  controllers: [SettingsController]
})
export class SettingsModule {}
