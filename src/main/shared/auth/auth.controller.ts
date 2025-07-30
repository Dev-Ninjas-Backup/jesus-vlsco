import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailLoginDto, SuperAdminLoginDto } from './dto/email-login.dto';
import { VerifyOTPDto } from './dto/verify-otp.dto';
import { AuthService } from './services/auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Email login -- Requests OTP' })
  @Post('login/email')
  emailLogin(@Body() dto: EmailLoginDto) {
    return this.authService.emailLogin(dto);
  }

  @ApiOperation({ summary: 'Verify OTP sent to email' })
  @Post('verify/email')
  verifyOtp(@Body() dto: VerifyOTPDto) {
    return this.authService.verifyOTP(dto.email, dto.otp);
  }

  @ApiOperation({
    summary: 'Super admin login with predefined email and password',
  })
  @Post('login/super-admin')
  superAdminLogin(@Body() dto: SuperAdminLoginDto) {
    return this.authService.superAdminLogin(dto.email, dto.password);
  }
}
