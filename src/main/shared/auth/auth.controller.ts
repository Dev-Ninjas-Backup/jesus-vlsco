import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EmailLoginDto, SuperAdminLoginDto } from './dto/email-login.dto';
import { PhoneLoginDto } from './dto/phone-login.dto';
import { VerifyOTPDto } from './dto/verify-otp.dto';

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

  @ApiOperation({ summary: 'Phone login with firebase token' })
  @Post('login/phone')
  async phoneLogin(@Body() dto: PhoneLoginDto) {
    return this.authService.phoneLogin(dto.firebaseIdToken);
  }

  @ApiOperation({
    summary: 'Super admin login with predefined email and password',
  })
  @Post('login/super-admin')
  superAdminLogin(@Body() dto: SuperAdminLoginDto) {
    return this.authService.superAdminLogin(dto.email, dto.password);
  }
}
