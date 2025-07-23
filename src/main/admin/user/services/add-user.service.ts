import { Injectable } from '@nestjs/common';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { AddUserDto } from '../dto/add-user.dto';
import { UtilsService } from '@project/lib/utils/utils.service';

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

    // * check if phone already exists
    const existingPhone = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
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
        phone: dto.phone,
        employeeID: dto.employeeID,
        email: dto.email,
        role: dto.role,
        password: await this.utils.hash(dto.password ?? ''),
        pinCode: dto.pinCode,
        profile: {
          create: {
            profileUrl: uploadedUrl,
            firstName: dto.firstName,
            lastName: dto.lastName,
            gender: dto.gender,
            jobTitle: dto.jobTitle,
            department: dto.department,
            address: dto.address,
            city: dto.city,
            state: dto.state,
            dob: dto.dob,
            country: dto.country,
            nationality: dto.nationality,
          },
        },
      },
    });

    const result = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
      },
    });

    return successResponse(result, 'User created successfully');
  }
}
