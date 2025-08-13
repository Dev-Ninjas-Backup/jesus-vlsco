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

    // 3. Build user update data
    const data: any = {};
    if (dto.email) data.email = dto.email;
    if (dto.phone) data.phone = removePlus;
    if (dto.employeeID) data.employeeID = dto.employeeID;
    if (dto.role) data.role = dto.role;
    if (dto.password) data.password = await this.utils.hash(dto.password);
    if (dto.pinCode !== undefined) data.pinCode = dto.pinCode;

    // 4. Fetch existing profile
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    // 5. Define default values for required profile fields
    const defaults = {
      firstName: 'NoFirstName',
      gender: 'PREFER_NOT_TO_SAY' as const,
      jobTitle: 'HR_MANAGER' as const,
      department: 'HR' as const,
      address: 'Not Provided',
      city: 'Not Provided',
      state: 'Not Provided',
      dob: new Date('2000-01-01'),
    };

    // 6. Build profile data using dto or defaults (required fields must be set)
    const profileData = {
      firstName:
        dto.firstName ?? existingProfile?.firstName ?? defaults.firstName,
      lastName: dto.lastName ?? existingProfile?.lastName ?? null,
      gender: dto.gender ?? existingProfile?.gender ?? defaults.gender,
      jobTitle: dto.jobTitle ?? existingProfile?.jobTitle ?? defaults.jobTitle,
      department:
        dto.department ?? existingProfile?.department ?? defaults.department,
      address: dto.address ?? existingProfile?.address ?? defaults.address,
      city: dto.city ?? existingProfile?.city ?? defaults.city,
      state: dto.state ?? existingProfile?.state ?? defaults.state,
      country: dto.country ?? existingProfile?.country ?? null,
      nationality: dto.nationality ?? existingProfile?.nationality ?? null,
      profileUrl:
        profileUrl !== null
          ? profileUrl
          : (existingProfile?.profileUrl ?? null),
    };

    // 7. Perform transaction: update user and profile
    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data,
      });

      if (existingProfile) {
        await tx.profile.update({
          where: { userId },
          data: profileData,
        });
      } else {
        await tx.profile.create({
          data: {
            userId,
            ...profileData,
            dob: defaults.dob,
          },
        });
      }

      return tx.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });
    });

    return successResponse(updated, 'User updated successfully');
  }
}
