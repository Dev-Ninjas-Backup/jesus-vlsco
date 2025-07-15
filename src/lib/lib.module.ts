import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { SeedModule } from './seed/seed.module';
import { UtilsService } from './utils/utils.service';

@Module({
  imports: [SeedModule, PrismaModule, MailModule],
  exports: [UtilsService],
  providers: [UtilsService],
})
export class LibModule {}
