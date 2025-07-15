import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { AddUserDto } from '../dto/add-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserWithProfile(dto: AddUserDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          phone: dto.phone,
          employeeID: dto.employeeID,
          email: dto.email,
          role: dto.role,
          otp: '',
          pinCode: dto.pinCode,
        },
      });

      const profile = await tx.profile.create({
        data: {
          ...dto.profile,
          userId: user.id,
        },
      });

      return { user, profile };
    });
  }
}
