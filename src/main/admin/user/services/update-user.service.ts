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
export class UpdateUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  @HandleError('Failed to update user')
  async updateUser(
    userId: string,
    dto: UpdateProfileDto,
    profileUrl: string | null,
  ): Promise<TResponse<any>> {
    // 1. Check user exists
    const existing = await this.utils.ensureUserExists(userId);
    const removePlus = dto.phone?.replace(/^\+/, '');

    // 2. Unique checks if changing email/phone/employeeID
    if (dto.email && dto.email !== existing.email) {
      const dup = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (dup) throw new AppError(400, 'Email already exists');
    }
    if (dto.phone && removePlus !== existing.phone) {
      const dup = await this.prisma.user.findUnique({
        where: { phone: removePlus },
      });
      if (dup) throw new AppError(400, 'Phone already exists');
    }
    if (dto.employeeID && dto.employeeID !== existing.employeeID) {
      const dup = await this.prisma.user.findUnique({
        where: { employeeID: dto.employeeID },
      });
      if (dup) throw new AppError(400, 'Employee ID already exists');
    }

    // 3. Build update data
    const data: any = {};
    if (dto.email) data.email = dto.email;
    if (dto.phone) data.phone = dto.phone;
    if (dto.employeeID) data.employeeID = dto.employeeID;
    if (dto.role) data.role = dto.role;
    if (dto.password) data.password = await this.utils.hash(dto.password);
    if (dto.pinCode) data.pinCode = dto.pinCode;

    // Profile updates
    const profileData: any = {};
    if (dto.firstName) profileData.firstName = dto.firstName;
    if (dto.lastName) profileData.lastName = dto.lastName;
    if (dto.gender) profileData.gender = dto.gender;
    if (dto.jobTitle) profileData.jobTitle = dto.jobTitle;
    if (dto.department) profileData.department = dto.department;
    if (dto.address) profileData.address = dto.address;
    if (dto.city) profileData.city = dto.city;
    if (dto.state) profileData.state = dto.state;
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
