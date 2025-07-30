import { Injectable } from '@nestjs/common';
import { PaginationDto } from '@project/common/dto/pagination.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UtilsService } from '@project/lib/utils/utils.service';

@Injectable()
export class ManageAdminService {
  constructor(private readonly prisma: PrismaService,private readonly utils:UtilsService) {}

  @HandleError('Failed to create admin')
  async createAdmin(dto: CreateAdminDto,profileUrl:string|null): Promise<TResponse<any>> {
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
            profileUrl:profileUrl,
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

    return successResponse(user, 'Admin created successfully');
  }

  @HandleError('Failed to get admins')
  async getAdmins(query: PaginationDto): Promise<TResponse<any>> {
    const page =
      query.page && query.page >= 1 ? Math.max(Number(query.page) || 1, 1) : 1;
    const limit = Math.min(Number(query.limit) || 10, 100);

    const admins = await this.prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return successResponse(admins, 'Admins retrieved successfully');
  }

  @HandleError('Failed to get admin')
  async getAAdmin(adminId: string): Promise<TResponse<any>> {
    const admin = await this.prisma.user.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      throw new AppError(404, 'Admin not found');
    }

    return successResponse(admin, 'Admin retrieved successfully');
  }

  @HandleError('Failed to delete admin')
  async deleteAdmin(adminId: string): Promise<TResponse<any>> {
    const admin = await this.prisma.user.delete({
      where: {
        id: adminId,
      },
    });

    return successResponse(admin, 'Admin deleted successfully');
  }
}
