import { Injectable } from '@nestjs/common';
import { Department, Gender, JopTitle } from '@prisma/client';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateFullUserDto } from '../dto/update-full-user.dto';

@Injectable()
export class UpdateFullUserService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to update user', 'USER')
  async updateFullUser(
    userId: string,
    dto: UpdateFullUserDto,
  ): Promise<TResponse<any>> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        profile: true,
        educations: true,
        experience: true,
        payroll: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // * update main data of profile
    const existingProfile = user.profile;

    // * data from dto from profile
    const firstName = dto?.profile?.firstName?.trim();
    const lastName = dto?.profile?.lastName?.trim();
    const gender = dto?.profile?.gender?.trim() as Gender;
    const jobTitle = dto?.profile?.jobTitle?.trim() as JopTitle;
    const department = dto?.profile?.department?.trim() as Department;
    const dob = dto?.profile?.dob?.trim();
    const address = dto?.profile?.address?.trim();
    const state = dto?.profile?.state?.trim();
    const country = dto?.profile?.country?.trim();
    const nationality = dto?.profile?.nationality?.trim();

    // * update profile
    await this.prisma.profile.update({
      where: { id: existingProfile?.id },
      data: {
        firstName: firstName ? firstName : existingProfile?.firstName,
        lastName: lastName ? lastName : existingProfile?.lastName,
        gender: gender ? gender : existingProfile?.gender,
        jobTitle: jobTitle ? jobTitle : existingProfile?.jobTitle,
        department: department ? department : existingProfile?.department,
        dob: dob ? dob : existingProfile?.dob,
        address: address ? address : existingProfile?.address,
        state: state ? state : existingProfile?.state,
        country: country ? country : existingProfile?.country,
        nationality: nationality ? nationality : existingProfile?.nationality,
      },
    });

    const updatedUserWithAllData = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        profile: true,
        educations: true,
        experience: true,
        payroll: true,
      },
    });

    return successResponse(updatedUserWithAllData, 'User updated successfully');
  }
}
