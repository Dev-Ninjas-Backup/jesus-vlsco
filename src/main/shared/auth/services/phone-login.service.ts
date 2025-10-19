import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '@project/common/dto/user-response.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { TelnyxService } from '@project/lib/telnyx/telnyx.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { PhoneLoginDto } from '../dto/phone-login.dto';
import { VerifyPhoneOTPDto } from '../dto/verify-otp.dto';

@Injectable()
export class PhoneLoginService {
  constructor(
    private readonly utils: UtilsService,
    private readonly prisma: PrismaService,
    private readonly telnyxService: TelnyxService,
  ) {}

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

    const title = 'This is your OTP';
    const message = `Your verification OTP is: ${otp}`;

    await this.telnyxService.sendSms(dto.phoneNumber, title, message);

    return successResponse(null, `An OTP has been sent to ${dto.phoneNumber}`);
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
        isVerified: true,
        lastLoginAt: new Date(),
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
