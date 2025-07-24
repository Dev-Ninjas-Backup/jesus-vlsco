import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  @HandleError('Error updating profile')
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    profileUrl: string | null,
  ): Promise<TResponse<any>> {
    // 1. Check user exists
    const existing = await this.utils.ensureUserExists(userId);

    // 2. Unique checks if changing email/phone/employeeID
    if (dto.email && dto.email !== existing.email) {
      const dup = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (dup) throw new AppError(400, 'Email already exists');
    }
    if (dto.phone && dto.phone !== existing.phone) {
      const dup = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (dup) throw new AppError(400, 'Phone already exists');
    }

    // 3. Build update data
    const data: any = {};
    if (dto.email) data.email = dto.email;
    if (dto.phone) {
      // * remove the + symbol
      const normalized = dto.phone.replace(/^\+/, '');
      data.phone = normalized;
    }
    if (dto.password) data.password = await this.utils.hash(dto.password);
    if (dto.pinCode) data.pinCode = dto.pinCode;

    // Profile updates
    const profileData: any = {};
    if (dto.firstName) profileData.firstName = dto.firstName;
    if (dto.lastName) profileData.lastName = dto.lastName;
    if (dto.gender) profileData.gender = dto.gender;
    if (dto.address) profileData.address = dto.address;
    if (dto.city) profileData.city = dto.city;
    if (dto.state) profileData.state = dto.state;
    if (dto.dob) profileData.dob = new Date(dto.dob);
    if (dto.country) profileData.country = dto.country;
    if (dto.nationality) profileData.nationality = dto.nationality;
    if (profileUrl !== null) profileData.profileUrl = profileUrl;

    // 4. Perform update
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        profile: {
          upsert: {
            create: profileData,
            update: profileData,
          },
        },
      },
      include: { profile: true },
    });

    return successResponse(updated, 'User updated successfully');
  }
}
