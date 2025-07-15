import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailLoginDto } from './dto/email-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  emailLogin(dto: EmailLoginDto) {
    return this.authService.emailLogin(dto);
  }

  // @Get(':id')
  // verifyOTP()  {
  //   return this.authService.findOne();
  // }
}
