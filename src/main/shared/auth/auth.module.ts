import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from '@project/lib/firebase/firebase.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UtilsService, JwtService, FirebaseService],
})
export class AuthModule {}
