import { Injectable } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) { }

  @HandleError('Failed to get company with branch')
  async getCompanyWithBranches() {
    const company = await this.prisma.companies.findFirst({
      include: {
        branches: {
          include: {
            manager: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    if (!company) {
      // *create company
      const newCompany = await this.prisma.companies.create({
        data: {
          name: 'TechCorp Inc.',
          location: 'San Francisco, CA',
        },
      });

      return successResponse(
        newCompany,
        'Company and branches created successfully',
      );
    }

    return successResponse(
      company,
      'Companies and branches retrieved successfully',
    );
  }

  @HandleError('Failed to get projects with managers')
  async getProjectsWithManagers() {
    const projects = await this.prisma.project.findMany({
      include: {
        manager: {
          include: {
            profile: true,
          },
        },
      },
    });

    return successResponse(
      projects,
      'Projects and managers retrieved successfully',
    );
  }
}
