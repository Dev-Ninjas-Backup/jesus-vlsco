import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';

@Module({
  imports: [],
  providers: [AdminService],
})
export class SeedModule {}
