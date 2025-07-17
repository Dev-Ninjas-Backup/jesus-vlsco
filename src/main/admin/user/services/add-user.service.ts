import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { AddUserDto } from '../dto/add-user.dto';

@Injectable()
export class AddUserService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Error creating user')
  async createUserWithProfile(
    dto: AddUserDto,
    uploadedUrl: string,
  ): Promise<TResponse<any>> {
    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        employeeID: dto.employeeID,
        email: dto.email,
        role: dto.role,
        password: dto.password,
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
    console.log(user);

    const result = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
      },
    });

    console.log(result);

    return successResponse(result, 'User created successfully');
  }
}
