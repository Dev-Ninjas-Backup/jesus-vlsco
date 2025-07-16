import { Global, Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';

@Global()
@Module({
  imports: [],
  providers: [AdminService],
})
export class SeedModule {}
