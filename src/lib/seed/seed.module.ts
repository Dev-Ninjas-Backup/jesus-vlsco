import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Module({
  imports: [],
  providers: [AdminService, UtilsService],
})
export class SeedModule {}
