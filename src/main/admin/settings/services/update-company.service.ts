import { Injectable, NotFoundException } from '@nestjs/common';
import { HandleError } from '@project/common/error/handle-error.decorator';
import { successResponse } from '@project/common/utils/response.util';
import { PrismaService } from '@project/lib/prisma/prisma.service';
import { UpdateCompanyWithBranchesDto } from '../dto/updateCompany.dto';
import { AppError } from '@project/common/error/handle-error.app';

@Injectable()
export class UpdateCompanyService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to update company')
  async updateCompanyWithBranches(
    companyId: string,
    dto: UpdateCompanyWithBranchesDto,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      // Step 1: Check if the company exists
      const existingCompany = await tx.companies.findUnique({
        where: { id: companyId },
      });

      if (!existingCompany) {
        throw new AppError(404, 'Company not found');
      }

      // Step 2: Update the company (partial fields)
      const updatedCompany = await tx.companies.update({
        where: { id: companyId },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.location && { location: dto.location }),
          //   ...(dto.logo && { logo: dto.logo }),
        },
      });

      // Step 3: Update the specific branches (if provided)
      if (dto.branches?.length) {
        for (const branch of dto.branches) {
          const { id, ...branchData } = branch;

          const existingBranch = await tx.companiesBranch.findUnique({
            where: { id },
          });

          if (!existingBranch || existingBranch.companyId !== companyId) {
            throw new NotFoundException(
              `Branch with ID ${id} not found or doesn't belong to this company`,
            );
          }

          await tx.companiesBranch.update({
            where: { id },
            data: branchData,
          });
        }
      }

      return successResponse(
        updatedCompany,
        'Company and branches updated successfully',
      );
    });
  }
}
