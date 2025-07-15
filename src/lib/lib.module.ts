import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { SeedModule } from './seed/seed.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [SeedModule, PrismaModule, MailModule, UtilsModule],
  exports: [],
  providers: [],
})
export class LibModule {}
