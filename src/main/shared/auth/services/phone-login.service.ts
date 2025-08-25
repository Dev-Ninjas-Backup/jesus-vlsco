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
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { Twilio } from 'twilio';
import { PhoneLoginDto } from '../dto/phone-login.dto';
import { VerifyPhoneOTPDto } from '../dto/verify-otp.dto';

@Injectable()
export class PhoneLoginService {
  private twilio: Twilio;
  private fromPhone: string;

  constructor(
    private readonly config: ConfigService,
    private readonly utils: UtilsService,
    private readonly prisma: PrismaService,
  ) {
    this.twilio = new Twilio(
      this.config.getOrThrow(ENVEnum.TWILIO_ACCOUNT_SID),
      this.config.getOrThrow(ENVEnum.TWILIO_AUTH_TOKEN),
    );
    this.fromPhone = this.config.getOrThrow(ENVEnum.TWILIO_PHONE_NUMBER);
  }

  @HandleError('Error sending OTP')
  async phoneLogin(dto: PhoneLoginDto): Promise<TResponse<any>> {
    const { otp, expiryTime } = this.utils.generateOtpAndExpiry();
    const removePlus = dto.phoneNumber.replace(/^\+/, '');

    const user = await this.prisma.user.update({
      where: { phone: removePlus },
      data: {
        otp: await this.utils.hash(otp.toString()),
        otpExpiresAt: expiryTime,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // * add plus to phone number if not present
    if (!dto.phoneNumber.startsWith('+')) {
      dto.phoneNumber = `+${dto.phoneNumber}`;
    }

    try {
      const message = await this.twilio.messages.create({
        body: `Your OTP is ${otp}`,
        from: this.fromPhone,
        to: dto.phoneNumber,
      });
      console.info(message);
    } catch (error) {
      console.error(error);
      throw new AppError(500, 'Failed to send OTP');
    }

    return successResponse(null, 'OTP sent successfully');
  }

  @HandleError('Error verifying OTP')
  async verifyPhoneOtp(dto: VerifyPhoneOTPDto): Promise<TResponse<any>> {
    const removePlus = dto.phoneNumber.replace(/^\+/, '');

    const user = await this.prisma.user.findUnique({
      where: { phone: removePlus },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (!user.otp || !user.otpExpiresAt) {
      throw new AppError(400, 'No OTP was requested.');
    }

    // Check if OTP expired
    if (new Date() > user.otpExpiresAt) {
      throw new AppError(400, 'OTP has expired.');
    }

    const isMatch = await this.utils.compare(dto.otp.toString(), user.otp);

    if (!isMatch) {
      throw new AppError(401, 'Invalid OTP');
    }

    // Clear OTP fields for security & update login status
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpiresAt: null,
      },
      include: { profile: true, shift: true },
    });

    return successResponse({
      user: {
        ...this.utils.sanitizedResponse(UserResponseDto, updatedUser),
        profile: updatedUser.profile,
        shift: updatedUser.shift,
      },
      token: this.utils.generateToken({
        email: updatedUser.email,
        roles: updatedUser.role,
        sub: updatedUser.id,
      }),
    });
  }
}
