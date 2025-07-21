import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { CreateCompanyWithBranchDto } from '../dto/createCompany.dto';
import { successResponse } from '@project/common/utils/response.util';

@Injectable()
export class CreateCompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompany(dto: CreateCompanyWithBranchDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const company = await tx.companies.create({
        data: {
          name: dto.name,
          location: dto.location,
          // logo: dto.logo,
        },
      });

      await tx.companiesBranch.createMany({
        data: dto.branches.map((branch) => ({
          ...branch,
          companyId: company.id,
        })),
      });

      return company;
    });

    return successResponse(result, 'Company and branches created successfully');
  }
}
