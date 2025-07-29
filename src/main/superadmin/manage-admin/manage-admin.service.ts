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

@Injectable()
export class ManageAdminService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to create admin')
  async createAdmin(dto: CreateAdminDto): Promise<TResponse<any>> {
    const result = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        employeeID: dto.employeeID,
        email: dto.email,
        role: 'ADMIN',
      },
    });

    return successResponse(result, 'Admin created successfully');
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
