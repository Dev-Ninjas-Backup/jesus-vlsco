import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '@project/common/dto/user-response.dto';
import { AppError } from '@project/common/error/handle-error.app';
import { HandleError } from '@project/common/error/handle-error.decorator';
import {
  successPaginatedResponse,
  successResponse,
  TPaginatedResponse,
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
        projects: true,
        shift: true,
        team: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Extract only the main user fields
    const {
      profile,
      educations,
      experience,
      payroll,
      projects,
      shift,
      ...mainUser
    } = user;

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
      projects,

      shift,
    };

    return successResponse(data, 'User data fetched successfully');
  }

  // Get All users (employee)
  @HandleError('Failed to fetch users')
  async getAllUsers(dto: GetUsersDto): Promise<TPaginatedResponse<any>> {
    const builder = new PrismaUserQueryBuilder(dto)
      .search([
        'email',
        'phone',
        'employeeID',
        'profile.firstName',
        'profile.lastName',
      ])
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
          projects: true,
          team: true,
          shift: true,
        },
      }),
      builder.countTotal(this.prisma.user),
    ]);

    const sanitizedUsers = users.map((user) => {
      const {
        profile,
        educations,
        experience,
        payroll,
        projects,
        team,
        shift,
        ...mainUser
      } = user;
      const sanitizedUser = this.utils.sanitizedResponse(
        UserResponseDto,
        mainUser,
      );

      return {
        ...sanitizedUser,
        profile,
        educations,
        experience,
        payroll,
        projects,
        team,
        shift,
      };
    });

    return successPaginatedResponse(
      sanitizedUsers,
      {
        page: meta.page,
        limit: meta.limit,
        total: meta.total,
      },
      'Users fetched successfully',
    );
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

  @HandleError('Failed to fetch all assigned users of any shift')
  async getAllAssignedUsersOfAnyShift(): Promise<TResponse<any>> {
    // 1. Fetch all shifts with users
    const shifts = await this.prisma.shift.findMany({
      where: {
        users: { some: {} }, // only shifts with at least 1 user
      },
      include: {
        users: {
          include: { profile: true }, // include user profile
        },
      },
    });

    // 2. Fetch all projects that include the shifts
    const projects = await this.prisma.project.findMany({
      where: {
        projectUsers: { some: {} },
      },
      include: {
        projectUsers: true,
        shifts: true,
      },
    });
    // console.log("projects", projects);

    // 3. Build dynamic output
    const outputData = shifts.flatMap((shift) =>
      shift.users.map((user) => {
        // Find the project that has this shift AND user assigned
        const project = projects.find((p) =>
          // p.shifts.some((s) => s.id === shift.id) &&
          p.projectUsers.some((pu) => pu.userId === user.id),
        );

        return {
          date: shift.date,
          project: project
            ? {
                id: project.id,
                title: project.title,
                location: project.projectLocation,
              }
            : null,
          shift: {
            id: shift.id,
            startTime: shift.startTime,
            endTime: shift.endTime,
            shiftType: shift.shiftType,
            allDay: shift.allDay,
            note: shift.note,
          },
          profile: {
            id: user.id,
            firstName: user.profile?.firstName || '',
            lastName: user.profile?.lastName || '',
            profileUrl: user.profile?.profileUrl || '',
            email: user.email || '',
          },
        };
      }),
    );

    return successResponse(outputData, 'Assigned users fetched successfully');
  }
}
