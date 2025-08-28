import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { AddUserDto } from '../dto/add-user.dto';

@Injectable()
export class AddUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  @HandleError('Error creating user')
  async createUserWithProfile(
    dto: AddUserDto,
    uploadedUrl: string | null,
  ): Promise<TResponse<any>> {
    // * check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new AppError(400, 'Email already exists');
    }
    let phone = dto.phone;

    // * replace + with space in phone number
    if (dto.phone) {
      phone = dto.phone.replace(/\+/g, ' ');
    }

    // * check if phone already exists
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      throw new AppError(400, 'Phone already exists');
    }

    // * check if employeeID already exists
    const existingEmployeeID = await this.prisma.user.findUnique({
      where: { employeeID: dto.employeeID },
    });

    if (existingEmployeeID) {
      throw new AppError(400, 'Employee ID already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        phone,
        employeeID: dto.employeeID,
        email: dto.email,
        role: dto.role ?? 'EMPLOYEE',
        password: await this.utils.hash(dto.password ?? ''),
        pinCode: dto.pinCode,
        profile: {
          create: {
            profileUrl: uploadedUrl,
            firstName: dto.firstName,
            lastName: dto.lastName,
            gender: dto.gender ?? 'MALE',
            jobTitle: dto.jobTitle ?? 'MARKETING_MANAGER',
            department: dto.department ?? 'MARKETING',
            address: dto.address ?? 'Unknown',
            city: dto.city ?? 'Unknown',
            state: dto.state ?? 'Unknown',
            dob: dto.dob ?? new Date(),
            country: dto.country,
            nationality: dto.nationality,
          },
        },
      },
    });

    // * create payroll with default values
    await this.prisma.payroll.create({
      data: {
        userId: user.id,
        regularPayRate: 10,
        regularPayRateType: 'DAY',
        overTimePayRate: 10,
        overTimePayRateType: 'DAY',
        casualLeave: 10,
        sickLeave: 14,
        numberOffDay: 1,
        offDay: ['SUNDAY'],
      },
    });

    const result = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        payroll: true,
      },
    });

    return successResponse(result, 'User created successfully');
  }

  @HandleError('Error creating user')
  async deleteUser(userId: string): Promise<TResponse<any>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(400, 'User not found');
    }

    await this.prisma.user.delete({
      where: { id: user.id },
    });

    return successResponse(null, 'User deleted successfully');
  }
}
