import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from '@project/lib/firebase/firebase.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { AuthController } from './auth.controller';
import { EmailLoginService } from './services/email-login.service';
import { PhoneLoginService } from './services/phone-login.service';

@Module({
  controllers: [AuthController],
  providers: [
    EmailLoginService,
    UtilsService,
    JwtService,
    FirebaseService,
    PhoneLoginService,
  ],
})
export class AuthModule {}
