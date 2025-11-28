import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserResponseDto } from '@project/common/dto/user-response.dto';
import { ENVEnum } from '@project/common/enum/env.enum';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { MailService } from '@project/lib/mail/mail.service';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { EmailLoginDto } from '../dto/email-login.dto';

@Injectable()
export class EmailLoginService {
  private APPLE_REVIEW_EMAIL = 'avijitavi338895@gmail.com';
  private APPLE_REVIEW_OTP = '111111';

  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {
    this.APPLE_REVIEW_EMAIL = this.configService.get(
      ENVEnum.APPLE_REVIEW_EMAIL,
    ) as string;
    this.APPLE_REVIEW_OTP = this.configService.get(
      ENVEnum.APPLE_REVIEW_OTP,
    ) as string;
  }

  @HandleError('Error sending OTP')
  async emailLogin(dto: EmailLoginDto): Promise<TResponse<any>> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: dto.email,
          mode: 'insensitive',
        },
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Apple Review Special Handling
    if (dto.email.toLowerCase() === this.APPLE_REVIEW_EMAIL) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          otp: await this.utils.hash(this.APPLE_REVIEW_OTP),
          otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      return successResponse(
        null,
        `Use OTP: ${this.APPLE_REVIEW_OTP} to login for review.`,
      );
    }

    // Normal flow
    const { otp, expiryTime } = this.utils.generateOtpAndExpiry();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp: await this.utils.hash(otp.toString()),
        otpExpiresAt: expiryTime,
      },
    });

    // Send OTP to user's email
    await this.mailService.sendLoginCodeEmail(
      user.email.toLowerCase(),
      otp.toString(),
    );

    return successResponse(
      null,
      `An OTP has been sent to ${user.email}. Please check your inbox.`,
    );
  }

  @HandleError('Error verifying OTP')
  async verifyOTP(email: string, otp: number): Promise<TResponse<any>> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Apple Review Special Handling
    if (email.toLowerCase() === this.APPLE_REVIEW_EMAIL) {
      if (otp.toString() !== this.APPLE_REVIEW_OTP) {
        throw new AppError(401, 'Invalid OTP (Review)');
      }

      // No expiry check for review user
    } else {
      // Normal user OTP validation
      if (!user.otp || !user.otpExpiresAt) {
        throw new AppError(400, 'No OTP was requested.');
      }

      if (new Date() > user.otpExpiresAt) {
        throw new AppError(400, 'OTP has expired.');
      }

      const isMatch = await this.utils.compare(otp.toString(), user.otp);
      if (!isMatch) {
        throw new AppError(401, 'Invalid OTP');
      }
    }

    // Clear OTP fields for security & update login status
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpiresAt: null,
        isLogin: true,
        isVerified: true,
        lastLoginAt: new Date(),
      },
      include: {
        profile: true,
        shift: true,
      },
    });

    const userWithOutProfile = {
      ...updatedUser,
      profile: undefined,
    };

    const data = {
      user: {
        ...this.utils.sanitizedResponse(UserResponseDto, userWithOutProfile),
        profile: updatedUser.profile,
        shift: updatedUser.shift,
      },
      token: this.utils.generateToken({
        email: user.email,
        roles: user.role,
        sub: user.id,
      }),
    };

    return successResponse(data, 'Login successful');
  }

  @HandleError('Super admin login error')
  async superAdminLogin(
    email: string,
    password: string,
  ): Promise<TResponse<any>> {
    const superAdmin = await this.prisma.user.findFirst({
      where: {
        role: 'SUPER_ADMIN',
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      include: { profile: true, shift: true },
    });

    if (!superAdmin) {
      throw new AppError(404, 'Super admin not found');
    }

    if (!(await this.utils.compare(password, superAdmin.password || ''))) {
      throw new AppError(401, 'Invalid password');
    }

    const data = {
      user: {
        ...this.utils.sanitizedResponse(UserResponseDto, superAdmin),
        profile: superAdmin.profile,
        shift: superAdmin.shift,
      },
      token: this.utils.generateToken({
        email: superAdmin.email,
        roles: superAdmin.role,
        sub: superAdmin.id,
      }),
    };

    return successResponse(data, 'Login successful');
  }
}
