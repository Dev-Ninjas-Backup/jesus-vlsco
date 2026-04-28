import { Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FileModule } from './file/file.module';
import { MailModule } from './mail/mail.module';
import { MulterModule } from './multer/multer.module';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { SeedModule } from './seed/seed.module';
import { UtilsModule } from './utils/utils.module';
import { TelnyxModule } from './telnyx/telnyx.module';

@Module({
  imports: [
    SeedModule,
    PrismaModule,
    MailModule,
    UtilsModule,
    CloudinaryModule,
    MulterModule,
    QueueModule,
    FileModule,
    TelnyxModule,
  ],
  exports: [],
  providers: [],
})
export class LibModule {}
