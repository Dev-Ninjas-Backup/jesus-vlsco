import { Module } from '@nestjs/common';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FirebaseModule } from './firebase/firebase.module';
import { MailModule } from './mail/mail.module';
import { MulterModule } from './multer/multer.module';
import { PrismaModule } from './prisma/prisma.module';
import { SeedModule } from './seed/seed.module';
import { UtilsModule } from './utils/utils.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    SeedModule,
    PrismaModule,
    MailModule,
    UtilsModule,
    CloudinaryModule,
    MulterModule,
    FirebaseModule,
    QueueModule,
  ],
  exports: [],
  providers: [],
})
export class LibModule {}
