import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-errors.app';
import { ErrorMessages } from '@project/common/error/handle-errors.message';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { EmailLoginDto } from './dto/email-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  async emailLogin(dto: EmailLoginDto): Promise<TResponse<any>> {
    // * find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // * if user not found
    if (!user) {
      throw new AppError(404, ErrorMessages['USER_NOT_FOUND'](dto.email));
    }
    // * if user found
    const { otp, expiryTime } = this.utils.generateOtpAndExpiry();

    const token = this.utils.generateToken({
      email: dto.email,
      roles: user.role,
      sub: user.id,
    });

    // * update user otp
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        otp: await this.utils.hash(otp.toString()),
        otpExpiresAt: expiryTime,
      },
    });

    return successResponse({ token });
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }
}
