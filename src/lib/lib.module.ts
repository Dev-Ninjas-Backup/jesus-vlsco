import { Module } from '@nestjs/common';
import { UtilsService } from './utils/utils.service';

@Module({
  exports: [UtilsService],
  providers: [UtilsService],
})
export class LibModule {}
