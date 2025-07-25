import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UtilsService } from '@project/lib/utils/utils.service';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from '@project/lib/firebase/firebase.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UtilsService, JwtService, FirebaseService],
})
export class AuthModule {}
