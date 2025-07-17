import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dto/email-login.dto';
import { VerifyOTPDto } from './dto/verify-otp.dto';
import { PhoneLoginDto } from './dto/phone-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/email')
  emailLogin(@Body() dto: EmailLoginDto) {
    return this.authService.emailLogin(dto);
  }

  @Post('verify/email')
  verifyOtp(@Body() dto: VerifyOTPDto) {
    return this.authService.verifyOTP(dto.email, dto.otp);
  }

  @Post('login/phone')
  async phoneLogin(@Body() dto: PhoneLoginDto) {
    return this.authService.phoneLogin(dto.firebaseIdToken);
  }
}
