import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '@project/common/dto/user-response.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successResponse,
  TResponse,
} from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UtilsService } from '@project/lib/utils/utils.service';
import { GetUsersDto } from '../dto/get-users.dto';
import { PrismaUserQueryBuilder } from '../helper/querybuilder';

@Injectable()
export class GetUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: UtilsService,
  ) {}

  private async findUserBy(
    key: 'id' | 'email' | 'phone' | 'employeeID',
    value: string | number,
  ): Promise<TResponse<any>> {
    const where: any = {};
    where[key] = value;

    const user = await this.prisma.user.findUnique({
      where,
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

    // Extract only the main user fields
    const { profile, educations, experience, payroll, ...mainUser } = user;

    const sanitizedUser = this.utils.sanitizedResponse(
      UserResponseDto,
      mainUser,
    );

    // Rebuild the full object: sanitized user + full raw relations
    const data = {
      ...sanitizedUser,
      profile,
      educations,
      experience,
      payroll,
    };

    return successResponse(data, 'User data fetched successfully');
  }

  // Get All users (employee)
  async getAllUsers(dto: GetUsersDto) {
  const builder = new PrismaUserQueryBuilder(dto)
    .search(['email', 'phone', 'employeeID', 'profile.firstName', 'profile.lastName'])
    .filter()
    .sort(['email', 'createdAt', 'employeeID'])
    .paginate();

  const queryOptions = await builder.build();

  const [users, meta] = await Promise.all([
    this.prisma.user.findMany({
      ...queryOptions,
      include: {
        profile: true,
        educations: true,
        experience: true,
        payroll: true,
      },
    }),
    builder.countTotal(this.prisma.user),
  ]);

  return { data: users, meta };
}

  // Single User get by Id (employee)
  @HandleError('Failed to fetch user data by ID')
  async getUserById(id: string): Promise<TResponse<any>> {
    return this.findUserBy('id', id);
  }

  // Single User get by email (employee)
  @HandleError('Failed to fetch user data by email')
  async getUserByEmail(email: string): Promise<TResponse<any>> {
    return this.findUserBy('email', email);
  }

  // Single User get by phone (employee)
  @HandleError('Failed to fetch user data by phone')
  async getUserByPhone(phone: string): Promise<TResponse<any>> {
    return this.findUserBy('phone', phone);
  }

  // Single User get by employeeID (employee)
  @HandleError('Failed to fetch user data by employee ID')
  async getUserByEmployeeID(employeeID: number): Promise<TResponse<any>> {
    return this.findUserBy('employeeID', employeeID);
  }


}
