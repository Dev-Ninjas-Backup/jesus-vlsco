import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserEnum } from '@project/common/enum/user.enum';
import { JwtAuthGuard } from '@project/common/jwt/jwt-auth.guard';
import { Roles } from '@project/common/jwt/jwt-roles.decorator';
import { RolesGuard } from '@project/common/jwt/jwt-roles.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }
}
