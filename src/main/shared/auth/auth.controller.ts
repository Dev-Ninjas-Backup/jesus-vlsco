import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailLoginDto, SuperAdminLoginDto } from './dto/email-login.dto';
import { PhoneLoginDto } from './dto/phone-login.dto';
import { VerifyOTPDto, VerifyPhoneOTPDto } from './dto/verify-otp.dto';
import { EmailLoginService } from './services/email-login.service';
import { PhoneLoginService } from './services/phone-login.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly emailLoginService: EmailLoginService,
    private readonly phoneLoginService: PhoneLoginService,
  ) { }

  @ApiOperation({ summary: 'Email login -- Requests OTP' })
  @Post('login/email')
  emailLogin(@Body() dto: EmailLoginDto) {
    return this.emailLoginService.emailLogin(dto);
  }

  @ApiOperation({ summary: 'Verify OTP sent to email' })
  @Post('verify/email')
  verifyOtp(@Body() dto: VerifyOTPDto) {
    return this.emailLoginService.verifyOTP(dto.email, dto.otp);
  }

  @ApiOperation({ summary: 'Phone login -- Requests OTP' })
  @Post('login/phone')
  phoneLogin(@Body() dto: PhoneLoginDto) {
    return this.phoneLoginService.phoneLogin(dto);
  }

  @ApiOperation({ summary: 'Verify OTP sent to phone' })
  @Post('verify/phone')
  verifyPhoneOtp(@Body() dto: VerifyPhoneOTPDto) {
    return this.phoneLoginService.verifyPhoneOtp(dto);
  }

  @ApiOperation({
    summary: 'Super admin login with predefined email and password',
  })
  @Post('login/super-admin')
  superAdminLogin(@Body() dto: SuperAdminLoginDto) {
    return this.emailLoginService.superAdminLogin(dto.email, dto.password);
  }
}
