import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-errors.app';
import { HandleErrors } from '@project/common/error/handle-errors.decorator';
import { ErrorMessages } from '@project/common/error/handle-errors.message';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { FirebaseService } from '@project/lib/firebase/firebase.service';
import { MailService } from '@project/lib/mail/mail.service';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { EmailLoginDto } from './dto/email-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
    private readonly mailService: MailService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @HandleErrors('Error sending OTP')
  async emailLogin(dto: EmailLoginDto): Promise<TResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new AppError(404, ErrorMessages['USER_NOT_FOUND'](dto.email));
    }

    const { otp, expiryTime } = this.utils.generateOtpAndExpiry();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otp: await this.utils.hash(otp.toString()),
        otpExpiresAt: expiryTime,
      },
    });

    // Send OTP to user's email
    await this.mailService.sendLoginCodeEmail(user.email, otp.toString());

    return successResponse(null, 'OTP sent successfully');
  }

  @HandleErrors('Error verifying OTP')
  async verifyOTP(email: string, otp: number): Promise<TResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(404, ErrorMessages['USER_NOT_FOUND'](email));
    }

    if (!user.otp || !user.otpExpiresAt) {
      throw new AppError(400, 'No OTP was requested.');
    }

    // Check if OTP expired
    if (new Date() > user.otpExpiresAt) {
      throw new AppError(400, 'OTP has expired.');
    }

    const isMatch = await this.utils.compare(otp.toString(), user.otp);

    if (!isMatch) {
      throw new AppError(401, 'Invalid OTP');
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
    });

    const token = this.utils.generateToken({
      email: user.email,
      roles: user.role,
      sub: user.id,
    });

    return successResponse({ user: updatedUser, token }, 'Login successful');
  }

  @HandleErrors('Phone login error')
  async phoneLogin(firebaseIdToken: string): Promise<TResponse<any>> {
    const decoded = await this.firebaseService.verifyIdToken(firebaseIdToken);

    if (!decoded.phone_number) {
      throw new AppError(400, 'Phone number not found in token');
    }

    const normalized = decoded.phone_number.replace(/^\+/, ''); // strips '+'

    const user = await this.prisma.user.findUnique({
      where: { phone: normalized },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isLogin: true,
        isVerified: true,
        lastLoginAt: new Date(),
        otp: null,
        otpExpiresAt: null,
      },
    });

    const token = this.utils.generateToken({
      email: user.email,
      roles: user.role,
      sub: user.id,
    });

    return successResponse({ user: updatedUser, token }, 'Login successful');
  }
}
