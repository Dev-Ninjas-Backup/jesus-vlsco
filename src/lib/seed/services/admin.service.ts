import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENVEnum } from '@project/common/enum/env.enum';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import chalk from 'chalk';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit(): Promise<void> {
    return this.seedAdminUser();
  }

  async seedAdminUser(): Promise<void> {
    const adminEmail = this.configService.getOrThrow<string>(
      ENVEnum.ADMIN_EMAIL,
    );
    const adminPass = this.configService.getOrThrow<string>(ENVEnum.ADMIN_PASS);
    const adminOTP = this.configService.getOrThrow<string>(ENVEnum.ADMIN_OTP);

    const adminExists = await this.prisma.user.findFirst({
      where: {
        email: adminEmail,
      },
    });

    // * create admin
    if (!adminExists) {
      const user = await this.prisma.user.create({
        data: {
          email: adminEmail,
          password: await this.utils.hash(adminPass),
          otp: await this.utils.hash(adminOTP),
          isLogin: true,
          lastLoginAt: new Date(),
          role: 'ADMIN',
        },
      });
      console.info(
        chalk.bgGreen.white.bold(
          `🚀 Admin user created with email: ${adminEmail} and id ${user.id}`,
        ),
      );
      return;
    }

    // * update login
    const admin = await this.prisma.user.update({
      where: {
        email: adminEmail,
      },
      data: {
        isLogin: true,
        lastLoginAt: new Date(),
      },
    });
    console.info(
      chalk.bgGreen.white.bold(
        `🚀 Admin user updated with email: ${adminEmail} and id ${admin.id}`,
      ),
    );
  }
}
